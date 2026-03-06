import React from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';

export default function VacinaTable({ vacinas, onEdit, onDelete }) {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  return (
    <table>
      <thead>
        <tr>
          <th>Código</th>
          <th>Vacina</th>
          <th>Cadastrada em</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody>
        {vacinas.map((v) => (
          <tr key={v.id}>
            <td>{v.codigo}</td>
            <td>{v.nome}</td>
            <td>{formatDate(v.cadastrado_em)}</td>
            <td>
              <button onClick={() => onEdit(v)} title="Editar" style={{ background: 'none', border: 'none' }}>
                <FaEdit color="#1976d2" size={18} />
              </button>
              <button
                onClick={() => {
                  if (window.confirm('Tem certeza que deseja excluir esta vacina?')) {
                    onDelete(v.id);
                  }
                }}
                title="Excluir"
                style={{ background: 'none', border: 'none', marginLeft: '8px' }}
              >
                <FaTrash color="#d32f2f" size={18} />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
