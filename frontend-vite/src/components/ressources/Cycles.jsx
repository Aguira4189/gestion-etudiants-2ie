import { useState, useEffect } from 'react'
import api from '../../services/api'

export default function Cycles() {
  const [cycles, setCycles] = useState([])
  const [form, setForm] = useState({ libelle: '', duree_annees: '' })
  const [editId, setEditId] = useState(null)
  const [message, setMessage] = useState({ text: '', type: '' })

  const fetchCycles = async () => {
    try { const res = await api.get('/cycles'); setCycles(res.data) }
    catch { setCycles([]) }
  }

  useEffect(() => { fetchCycles() }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editId) { await api.put(`/cycles/${editId}`, form); setMessage({ text: 'Cycle modifié !', type: 'success' }) }
      else { await api.post('/cycles', form); setMessage({ text: 'Cycle ajouté !', type: 'success' }) }
      setForm({ libelle: '', duree_annees: '' }); setEditId(null); fetchCycles()
    } catch (err) { setMessage({ text: err.response?.data?.message || 'Erreur', type: 'error' }) }
    setTimeout(() => setMessage({ text: '', type: '' }), 3000)
  }

  const handleEdit = (c) => { setForm({ libelle: c.libelle, duree_annees: c.duree_annees }); setEditId(c.id) }
  const handleDelete = async (id) => { if (!confirm('Supprimer ?')) return; await api.delete(`/cycles/${id}`); fetchCycles() }

  return (
    <div>
      <h2 className="text-2xl font-bold text-blue-900 mb-6">🔄 Gestion des Cycles</h2>
      {message.text && <div className={`mb-4 p-3 rounded-lg ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{message.text}</div>}

      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <h3 className="text-lg font-semibold mb-4">{editId ? 'Modifier' : 'Ajouter'} un cycle</h3>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nom du cycle *</label>
            <input className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="ex: Licence, Master..." value={form.libelle} onChange={e => setForm({ ...form, libelle: e.target.value })} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Durée (années) *</label>
            <input type="number" min="1" max="10" className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={form.duree_annees} onChange={e => setForm({ ...form, duree_annees: e.target.value })} required />
          </div>
          <div className="md:col-span-2 flex gap-3">
            <button type="submit" className="bg-blue-700 text-white px-6 py-2 rounded-lg hover:bg-blue-800">{editId ? 'Modifier' : 'Ajouter'}</button>
            {editId && <button type="button" onClick={() => { setEditId(null); setForm({ libelle: '', duree_annees: '' }) }} className="bg-gray-400 text-white px-6 py-2 rounded-lg">Annuler</button>}
          </div>
        </form>
      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-blue-700 text-white">
            <tr><th className="px-4 py-3 text-left">#</th><th className="px-4 py-3 text-left">Nom</th><th className="px-4 py-3 text-left">Durée</th><th className="px-4 py-3 text-left">Actions</th></tr>
          </thead>
          <tbody>
            {cycles.length === 0 ? <tr><td colSpan="4" className="text-center py-6 text-gray-400">Aucun cycle</td></tr>
              : cycles.map((c, i) => (
                <tr key={c.id} className={i % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                  <td className="px-4 py-3">{i + 1}</td>
                  <td className="px-4 py-3 font-medium">{c.libelle}</td>
                  <td className="px-4 py-3">{c.duree_annees} an(s)</td>
                  <td className="px-4 py-3 flex gap-2">
                    <button onClick={() => handleEdit(c)} className="bg-yellow-400 text-white px-3 py-1 rounded text-xs">✏️ Modifier</button>
                    <button onClick={() => handleDelete(c.id)} className="bg-red-500 text-white px-3 py-1 rounded text-xs">🗑️ Supprimer</button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}