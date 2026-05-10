import { useState, useEffect } from 'react'
import api from '../../services/api'

export default function Parcours() {
  const [parcours, setParcours] = useState([])
  const [specialites, setSpecialites] = useState([])
  const [niveaux, setNiveaux] = useState([])
  const [cycles, setCycles] = useState([])
  const [form, setForm] = useState({ libelle: '', specialites_id: '', niveaux_id: '', cycles_id: '' })
  const [editId, setEditId] = useState(null)
  const [message, setMessage] = useState({ text: '', type: '' })

  const fetchAll = async () => {
    try {
      const [p, s, n, c] = await Promise.all([api.get('/parcours'), api.get('/specialites'), api.get('/niveaux'), api.get('/cycles')])
      setParcours(p.data); setSpecialites(s.data); setNiveaux(n.data); setCycles(c.data)
    } catch { setParcours([]) }
  }

  useEffect(() => { fetchAll() }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editId) { await api.put(`/parcours/${editId}`, form); setMessage({ text: 'Parcours modifié !', type: 'success' }) }
      else { await api.post('/parcours', form); setMessage({ text: 'Parcours ajouté !', type: 'success' }) }
      setForm({ libelle: '', specialites_id: '', niveaux_id: '', cycles_id: '' }); setEditId(null); fetchAll()
    } catch (err) { setMessage({ text: err.response?.data?.message || 'Erreur', type: 'error' }) }
    setTimeout(() => setMessage({ text: '', type: '' }), 3000)
  }

  const handleEdit = (p) => { setForm({ libelle: p.libelle, specialites_id: p.specialites_id, niveaux_id: p.niveaux_id, cycles_id: p.cycles_id || '' }); setEditId(p.id) }
  const handleDelete = async (id) => { if (!confirm('Supprimer ?')) return; await api.delete(`/parcours/${id}`); fetchAll() }

  return (
    <div>
      <h2 className="text-2xl font-bold text-blue-900 mb-6">🗺️ Gestion des Parcours</h2>
      {message.text && <div className={`mb-4 p-3 rounded-lg ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{message.text}</div>}

      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <h3 className="text-lg font-semibold mb-4">{editId ? 'Modifier' : 'Ajouter'} un parcours</h3>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nom *</label>
            <input className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={form.libelle} onChange={e => setForm({ ...form, libelle: e.target.value })} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Spécialité *</label>
            <select className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={form.specialites_id} onChange={e => setForm({ ...form, specialites_id: e.target.value })} required>
              <option value="">-- Choisir --</option>
              {specialites.map(s => <option key={s.id} value={s.id}>{s.libelle}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Niveau *</label>
            <select className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={form.niveaux_id} onChange={e => setForm({ ...form, niveaux_id: e.target.value })} required>
              <option value="">-- Choisir --</option>
              {niveaux.map(n => <option key={n.id} value={n.id}>{n.libelle}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Cycle</label>
            <select className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={form.cycles_id} onChange={e => setForm({ ...form, cycles_id: e.target.value })}>
              <option value="">-- Choisir --</option>
              {cycles.map(c => <option key={c.id} value={c.id}>{c.libelle}</option>)}
            </select>
          </div>
          <div className="md:col-span-2 flex gap-3">
            <button type="submit" className="bg-blue-700 text-white px-6 py-2 rounded-lg hover:bg-blue-800">{editId ? 'Modifier' : 'Ajouter'}</button>
            {editId && <button type="button" onClick={() => { setEditId(null); setForm({ libelle: '', specialites_id: '', niveaux_id: '', cycles_id: '' }) }} className="bg-gray-400 text-white px-6 py-2 rounded-lg">Annuler</button>}
          </div>
        </form>
      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-blue-700 text-white">
            <tr><th className="px-4 py-3 text-left">#</th><th className="px-4 py-3 text-left">Nom</th><th className="px-4 py-3 text-left">Spécialité</th><th className="px-4 py-3 text-left">Niveau</th><th className="px-4 py-3 text-left">Cycle</th><th className="px-4 py-3 text-left">Actions</th></tr>
          </thead>
          <tbody>
            {parcours.length === 0 ? <tr><td colSpan="6" className="text-center py-6 text-gray-400">Aucun parcours</td></tr>
              : parcours.map((p, i) => (
                <tr key={p.id} className={i % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                  <td className="px-4 py-3">{i + 1}</td>
                  <td className="px-4 py-3 font-medium">{p.libelle}</td>
                  <td className="px-4 py-3 text-gray-500">{p.specialite_libelle || '—'}</td>
                  <td className="px-4 py-3 text-gray-500">{p.niveau_libelle || '—'}</td>
                  <td className="px-4 py-3 text-gray-500">{p.cycle_libelle || '—'}</td>
                  <td className="px-4 py-3 flex gap-2">
                    <button onClick={() => handleEdit(p)} className="bg-yellow-400 text-white px-3 py-1 rounded text-xs">✏️ Modifier</button>
                    <button onClick={() => handleDelete(p.id)} className="bg-red-500 text-white px-3 py-1 rounded text-xs">🗑️ Supprimer</button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}