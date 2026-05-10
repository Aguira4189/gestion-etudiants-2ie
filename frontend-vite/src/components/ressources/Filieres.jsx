import { useState, useEffect } from 'react'
import api from '../../services/api'

export default function Filieres() {
  const [filieres, setFilieres] = useState([])
  const [form, setForm] = useState({ libelle: '', code: '', description: '' })
  const [editId, setEditId] = useState(null)
  const [message, setMessage] = useState({ text: '', type: '' })

  const fetchFilieres = async () => {
    try { const res = await api.get('/filieres'); setFilieres(res.data) }
    catch { setFilieres([]) }
  }

  useEffect(() => { fetchFilieres() }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editId) { await api.put(`/filieres/${editId}`, form); setMessage({ text: 'Filière modifiée !', type: 'success' }) }
      else { await api.post('/filieres', form); setMessage({ text: 'Filière ajoutée !', type: 'success' }) }
      setForm({ libelle: '', code: '', description: '' }); setEditId(null); fetchFilieres()
    } catch (err) { setMessage({ text: err.response?.data?.message || 'Erreur', type: 'error' }) }
    setTimeout(() => setMessage({ text: '', type: '' }), 3000)
  }

  const handleEdit = (f) => { setForm({ libelle: f.libelle, code: f.code || '', description: f.description || '' }); setEditId(f.id) }
  const handleDelete = async (id) => { if (!confirm('Supprimer ?')) return; await api.delete(`/filieres/${id}`); fetchFilieres() }

  return (
    <div>
      <h2 className="text-2xl font-bold text-blue-900 mb-6">📚 Gestion des Filières</h2>
      {message.text && <div className={`mb-4 p-3 rounded-lg ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{message.text}</div>}

      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <h3 className="text-lg font-semibold mb-4">{editId ? 'Modifier' : 'Ajouter'} une filière</h3>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nom *</label>
            <input className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={form.libelle} onChange={e => setForm({ ...form, libelle: e.target.value })} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Code</label>
            <input className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={form.code} onChange={e => setForm({ ...form, code: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <input className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
          </div>
          <div className="md:col-span-3 flex gap-3">
            <button type="submit" className="bg-blue-700 text-white px-6 py-2 rounded-lg hover:bg-blue-800">{editId ? 'Modifier' : 'Ajouter'}</button>
            {editId && <button type="button" onClick={() => { setEditId(null); setForm({ libelle: '', code: '', description: '' }) }} className="bg-gray-400 text-white px-6 py-2 rounded-lg">Annuler</button>}
          </div>
        </form>
      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-blue-700 text-white">
            <tr><th className="px-4 py-3 text-left">#</th><th className="px-4 py-3 text-left">Nom</th><th className="px-4 py-3 text-left">Code</th><th className="px-4 py-3 text-left">Description</th><th className="px-4 py-3 text-left">Actions</th></tr>
          </thead>
          <tbody>
            {filieres.length === 0 ? <tr><td colSpan="5" className="text-center py-6 text-gray-400">Aucune filière</td></tr>
              : filieres.map((f, i) => (
                <tr key={f.id} className={i % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                  <td className="px-4 py-3">{i + 1}</td>
                  <td className="px-4 py-3 font-medium">{f.libelle}</td>
                  <td className="px-4 py-3"><span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">{f.code || '—'}</span></td>
                  <td className="px-4 py-3 text-gray-500">{f.description || '—'}</td>
                  <td className="px-4 py-3 flex gap-2">
                    <button onClick={() => handleEdit(f)} className="bg-yellow-400 text-white px-3 py-1 rounded text-xs">✏️ Modifier</button>
                    <button onClick={() => handleDelete(f.id)} className="bg-red-500 text-white px-3 py-1 rounded text-xs">🗑️ Supprimer</button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}