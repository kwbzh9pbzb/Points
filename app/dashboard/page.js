'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabaseClient';

export default function Dashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [negocio, setNegocio] = useState(null);
  const [clientes, setClientes] = useState([]);
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [err, setErr] = useState('');

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push('/login');
      return;
    }

    const { data: neg, error: negErr } = await supabase
      .from('negocios')
      .select('*')
      .eq('auth_user_id', user.id)
      .maybeSingle();

    if (negErr || !neg) {
      setErr('Tu cuenta aun no esta activada. Escribenos para activarla.');
      setLoading(false);
      return;
    }
    setNegocio(neg);

    const { data: clis } = await supabase
      .from('clientes')
      .select('*')
      .eq('negocio_id', neg.id)
      .order('created_at', { ascending: false });

    setClientes(clis || []);
    setLoading(false);
  }

  async function addCliente(e) {
    e.preventDefault();
    if (!nombre.trim()) return;
    await supabase.from('clientes').insert({
      negocio_id: negocio.id,
      nombre: nombre.trim(),
      telefono: telefono.trim(),
    });
    setNombre('');
    setTelefono('');
    load();
  }

  async function registrarVisita(cliente) {
    await supabase
      .from('clientes')
      .update({
        puntos: cliente.puntos + 1,
        ultima_visita: new Date().toISOString().slice(0, 10),
      })
      .eq('id', cliente.id);
    await supabase.from('movimientos').insert({
      negocio_id: negocio.id,
      cliente_id: cliente.id,
      tipo: 'visita',
      puntos: 1,
    });
    load();
  }

  async function logout() {
    await supabase.auth.signOut();
    router.push('/login');
  }

  if (loading) return <div className="wrap center">Cargando...</div>;
  if (err) return <div className="wrap center"><p>{err}</p></div>;

  return (
    <div className="wrap">
      <div className="bar">
        <div>
          <b>{negocio.nombre}</b>
          <div className="muted">Plan {negocio.plan} / {negocio.estado}</div>
        </div>
        <button className="sm" onClick={logout}>Salir</button>
      </div>

      <div className="card">
        <h3>Agregar cliente</h3>
        <form onSubmit={addCliente}>
          <input placeholder="Nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} />
          <input placeholder="Telefono" value={telefono} onChange={(e) => setTelefono(e.target.value)} />
          <button className="pri" type="submit">Agregar</button>
        </form>
      </div>

      <div className="card">
        <h3>Clientes</h3>
        {clientes.length === 0 && <p className="muted">Aun no hay clientes registrados.</p>}
        {clientes.map((c) => (
          <div className="cust" key={c.id}>
            <div className="row">
              <span>{c.nombre}</span>
              <span className="badge">{c.puntos} pts</span>
            </div>
            <div className="muted">Ultima visita: {c.ultima_visita || '-'}</div>
            <button className="sm" onClick={() => registrarVisita(c)}>+ Registrar visita</button>
          </div>
        ))}
      </div>
    </div>
  );
}
