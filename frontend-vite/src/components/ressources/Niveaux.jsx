import { useState, useEffect } from 'react'
import api from '../../services/api'

export default function Niveaux() {
  const [niveaux, setNiveaux] = useState([])
  const [form, setForm] = useState({ libelle: '', ordre: '' })
  const [editId, setEditId] = useState(null)
  const [message, setMessage] = useState({ text: '', type: '' })

  const fetchNiveaux = async () => {
    try { const res = await api.get('/niveaux'); setNiveaux(res.data) }
    catch { setNiveaux([]) }
  }

  useEffect(() => { fetchNiveaux() }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editId) { await api.put(`/niveaux/${editId}`, form); setMessage({ text: 'Niveau modifié !', type: 'success' }) }
      else { await api.post('/niveaux', form); setMessage({ text: 'Niveau ajouté !', type: 'success' }) }
      setForm({ libelle: '', ordre: '' }); setEditId(null); fetchNiveaux()
    } catch (err) { setMessage({ text: err.response?.data?.message || 'Erreur', type: 'error' }) }
    setTimeout(() => setMessage({ text: '', type: '' }), 3000)
  }

  const handleEdit = (n) => { setForm({ libelle: n.libelle, ordre: n.ordre }); setEditId(n.id) }
  const handleDelete = async (id) => { if (!confirm('Supprimer ?')) return; await api.delete(`/niveaux/${id}`); fetchNiveaux() }

  return (
    <div>
      <h2 className="text-2xl font-bold text-blue-900 mb-6">📊 Gestion des Niveaux</h2>
      {message.text && <div className={`mb-4 p-3 rounded-lg ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{message.text}</div>}

      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <h3 className="text-lg font-semibold mb-4">{editId ? 'Modifier' : 'Ajouter'} un niveau</h3>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nom du niveau *</label>
            <input className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="ex: Licence 1, Master 2..." value={form.libelle} onChange={e => setForm({ ...form, libelle: e.target.value })} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ordre *</label>
            <input type="number" min="1" className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="1, 2, 3..." value={form.ordre} onChange={e => setForm({ ...form, ordre: e.target.value })} required />
          </div>
          <div className="md:col-span-2 flex gap-3">
            <button type="submit" className="bg-blue-700 text-white px-6 py-2 rounded-lg hover:bg-blue-800">{editId ? 'Modifier' : 'Ajouter'}</button>
            {editId && <button type="button" onClick={() => { setEditId(null); setForm({ libelle: '', ordre: '' }) }} className="bg-gray-400 text-white px-6 py-2 rounded-lg">Annuler</button>}
          </div>
        </form>
      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-blue-700 text-white">
            <tr><th className="px-4 py-3 text-left">#</th><th className="px-4 py-3 text-left">Nom</th><th className="px-4 py-3 text-left">Ordre</th><th className="px-4 py-3 text-left">Actions</th></tr>
          </thead>
          <tbody>
            {niveaux.length === 0 ? <tr><td colSpan="4" className="text-center py-6 text-gray-400">Aucun niveau</td></tr>
              : niveaux.map((n, i) => (
                <tr key={n.id} className={i % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                  <td className="px-4 py-3">{i + 1}</td>
                  <td className="px-4 py-3 font-medium">{n.libelle}</td>
                  <td className="px-4 py-3">{n.ordre}</td>
                  <td className="px-4 py-3 flex gap-2">
                    <button onClick={() => handleEdit(n)} className="bg-yellow-400 text-white px-3 py-1 rounded text-xs">✏️ Modifier</button>
                    <button onClick={() => handleDelete(n.id)} className="bg-red-500 text-white px-3 py-1 rounded text-xs">🗑️ Supprimer</button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}