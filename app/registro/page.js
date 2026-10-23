'use client';
import { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { supabase } from '../../lib/supabaseClient';

function RegistroForm() {
  const params = useSearchParams();
  const negocioId = params.get('negocio');
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [acepta, setAcepta] = useState(false);
  const [done, setDone] = useState(false);
  const [err, setErr] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setErr('');
    if (!acepta) {
      setErr('Debes aceptar los Terminos y el Aviso de Privacidad.');
      return;
    }
    if (!negocioId) {
      setErr('Falta el codigo del negocio en el link.');
      return;
    }
    const { error } = await supabase.from('clientes').insert({
      negocio_id: negocioId,
      nombre: nombre.trim(),
      telefono: telefono.trim(),
      acepto_terminos: true,
      acepto_terminos_en: new Date().toISOString(),
    });
    if (error) {
      setErr('No se pudo completar el registro.');
      return;
    }
    setDone(true);
  }

  if (done) {
    return (
      <div className="card narrow center">
        <p>Listo! Ya estas registrado.</p>
      </div>
    );
  }

  return (
    <div className="card narrow">
      <h2>Registrate en el programa de puntos</h2>
      <form onSubmit={handleSubmit}>
        <label>Tu nombre</label>
        <input value={nombre} onChange={(e) => setNombre(e.target.value)} required />
        <label>Tu telefono</label>
        <input value={telefono} onChange={(e) => setTelefono(e.target.value)} required />
        <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start', fontSize: 12, color: 'var(--muted)', margin: '6px 0 12px' }}>
          <input type="checkbox" style={{ width: 'auto' }} checked={acepta} onChange={(e) => setAcepta(e.target.checked)} />
          <span>Acepto los Terminos y el Aviso de Privacidad, y autorizo el uso de mis datos para registrar mis puntos.</span>
        </div>
        {err && <p className="error">{err}</p>}
        <button className="pri" type="submit" style={{ width: '100%' }}>Registrarme</button>
      </form>
    </div>
  );
}

export default function RegistroPage() {
  return (
    <div className="wrap">
      <Suspense fallback={<div className="center">Cargando...</div>}>
        <RegistroForm />
      </Suspense>
    </div>
  );
}
