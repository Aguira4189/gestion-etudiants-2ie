import { useState, useEffect } from 'react'
import api from '../../services/api'

export default function Ecoles() {
  const [ecoles, setEcoles] = useState([])
  const [form, setForm] = useState({ libelle: '', adresse: '', telephone: '', email: '' })
  const [editId, setEditId] = useState(null)
  const [message, setMessage] = useState({ text: '', type: '' })

  const fetchEcoles = async () => {
    try { const res = await api.get('/ecoles'); setEcoles(res.data) }
    catch { setEcoles([]) }
  }

  useEffect(() => { fetchEcoles() }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editId) { await api.put(`/ecoles/${editId}`, form); setMessage({ text: 'École modifiée !', type: 'success' }) }
      else { await api.post('/ecoles', form); setMessage({ text: 'École ajoutée !', type: 'success' }) }
      setForm({ libelle: '', adresse: '', telephone: '', email: '' })
      setEditId(null); fetchEcoles()
    } catch (err) { setMessage({ text: err.response?.data?.message || 'Erreur', type: 'error' }) }
    setTimeout(() => setMessage({ text: '', type: '' }), 3000)
  }

  const handleEdit = (e) => { setForm({ libelle: e.libelle, adresse: e.adresse || '', telephone: e.telephone || '', email: e.email || '' }); setEditId(e.id) }
  const handleDelete = async (id) => { if (!confirm('Supprimer ?')) return; await api.delete(`/ecoles/${id}`); fetchEcoles() }

  return (
    <div>
      <h2 className="text-2xl font-bold text-blue-900 mb-6">🏫 Gestion des Écoles</h2>
      {message.text && <div className={`mb-4 p-3 rounded-lg ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{message.text}</div>}

      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <h3 className="text-lg font-semibold mb-4">{editId ? 'Modifier' : 'Ajouter'} une école</h3>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nom de l'école *</label>
            <input className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={form.libelle} onChange={e => setForm({ ...form, libelle: e.target.value })} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
            <input className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={form.telephone} onChange={e => setForm({ ...form, telephone: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
            <input className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={form.adresse} onChange={e => setForm({ ...form, adresse: e.target.value })} />
          </div>
          <div className="md:col-span-2 flex gap-3">
            <button type="submit" className="bg-blue-700 text-white px-6 py-2 rounded-lg hover:bg-blue-800">{editId ? 'Modifier' : 'Ajouter'}</button>
            {editId && <button type="button" onClick={() => { setEditId(null); setForm({ libelle: '', adresse: '', telephone: '', email: '' }) }} className="bg-gray-400 text-white px-6 py-2 rounded-lg">Annuler</button>}
          </div>
        </form>
      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-blue-700 text-white">
            <tr><th className="px-4 py-3 text-left">#</th><th className="px-4 py-3 text-left">Nom</th><th className="px-4 py-3 text-left">Email</th><th className="px-4 py-3 text-left">Téléphone</th><th className="px-4 py-3 text-left">Actions</th></tr>
          </thead>
          <tbody>
            {ecoles.length === 0 ? <tr><td colSpan="5" className="text-center py-6 text-gray-400">Aucune école</td></tr>
              : ecoles.map((e, i) => (
                <tr key={e.id} className={i % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                  <td className="px-4 py-3">{i + 1}</td>
                  <td className="px-4 py-3 font-medium">{e.libelle}</td>
                  <td className="px-4 py-3 text-gray-500">{e.email || '—'}</td>
                  <td className="px-4 py-3 text-gray-500">{e.telephone || '—'}</td>
                  <td className="px-4 py-3 flex gap-2">
                    <button onClick={() => handleEdit(e)} className="bg-yellow-400 text-white px-3 py-1 rounded text-xs">✏️ Modifier</button>
                    <button onClick={() => handleDelete(e.id)} className="bg-red-500 text-white px-3 py-1 rounded text-xs">🗑️ Supprimer</button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}