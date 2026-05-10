import { useState, useEffect } from 'react'
import api from '../../services/api'

export default function AjouterEtudiant() {
  const [pays, setPays] = useState([])
  const [civilites, setCivilites] = useState([])
  const [message, setMessage] = useState({ text: '', type: '' })
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    nom: '', prenoms: '', civilites_id: '', pays_id: '',
    dateNaissance: '', email: '', telephone: ''
  })

  useEffect(() => {
    api.get('/pays').then(res => setPays(res.data)).catch(() => setPays([]))
    api.get('/civilites').then(res => setCivilites(res.data)).catch(() => setCivilites([]))
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await api.post('/etudiants', form)
      setMessage({ text: '✅ Étudiant ajouté avec succès !', type: 'success' })
      setForm({ nom: '', prenoms: '', civilites_id: '', pays_id: '', dateNaissance: '', email: '', telephone: '' })
    } catch (err) {
      setMessage({ text: err.response?.data?.message || '❌ Erreur lors de l\'ajout.', type: 'error' })
    }
    setLoading(false)
    setTimeout(() => setMessage({ text: '', type: '' }), 4000)
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-blue-900 mb-6">➕ Ajouter un étudiant</h2>
      {message.text && <div className={`mb-4 p-3 rounded-lg ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{message.text}</div>}

      <div className="bg-white rounded-xl shadow p-6">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Civilité *</label>
            <select className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={form.civilites_id} onChange={e => setForm({ ...form, civilites_id: e.target.value })} required>
              <option value="">-- Choisir --</option>
              {civilites.map(c => <option key={c.id} value={c.id}>{c.libelle}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nom *</label>
            <input className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={form.nom} onChange={e => setForm({ ...form, nom: e.target.value })} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Prénoms *</label>
            <input className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={form.prenoms} onChange={e => setForm({ ...form, prenoms: e.target.value })} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date de naissance</label>
            <input type="date" className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={form.dateNaissance} onChange={e => setForm({ ...form, dateNaissance: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Pays *</label>
            <select className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={form.pays_id} onChange={e => setForm({ ...form, pays_id: e.target.value })} required>
              <option value="">-- Choisir un pays --</option>
              {pays.map(p => <option key={p.id} value={p.id}>{p.libelle}</option>)}
            </select>
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
          <div className="md:col-span-2">
            <button type="submit" disabled={loading}
              className="bg-blue-700 text-white px-8 py-3 rounded-lg hover:bg-blue-800 transition font-semibold w-full">
              {loading ? 'Enregistrement...' : '💾 Enregistrer l\'étudiant'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}