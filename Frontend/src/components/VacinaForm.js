import React, { useState, useEffect } from 'react';

export default function VacinaForm({ onSubmit, initialData }) {
  const [codigo, setCodigo] = useState('');
  const [nome, setNome] = useState('');

  useEffect(() => {
    if (initialData) {
      setCodigo(initialData.codigo);
      setNome(initialData.nome);
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!codigo.trim() || !nome.trim()) {
      alert('Preencha todos os campos!');
      return;
    }
    onSubmit({ codigo, nome });
    setCodigo('');
    setNome('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        placeholder="Código da vacina"
        value={codigo}
        onChange={(e) => setCodigo(e.target.value)}
        required
      />
      <input
        placeholder="Nome da vacina"
        value={nome}
        onChange={(e) => setNome(e.target.value)}
        required
      />
      <button type="submit">Salvar</button>
    </form>
  );
}
