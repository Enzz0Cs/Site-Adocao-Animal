import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import './EstilosAbrigo.css';

const PageHeader = ({ title, backTo = '/home', children, dataTour = 'page-header' }) => {
  return (
    <header
      data-tour={dataTour}
      className="navbar custom-navbar shadow-sm mb-4"
      style={{ backgroundColor: '#FF69B4', minHeight: 72, padding: '12px 16px' }}
    >
      <div className="container-fluid d-flex align-items-center justify-content-between gap-3 flex-nowrap">
        <div className="d-flex align-items-center gap-3 min-w-0">
          {backTo && (
            <Link
              to={backTo}
              className="btn btn-dark d-inline-flex align-items-center justify-content-center flex-shrink-0"
              style={{ width: 40, height: 40, padding: 0 }}
            >
              <ArrowLeft size={20} />
            </Link>
          )}
          {!backTo && <div className="flex-shrink-0" style={{ width: 40, height: 40 }} />}
          <h1
            className="custom-title text-white m-0 text-truncate"
            style={{ fontSize: '1.25rem', lineHeight: 1.2 }}
          >
            {title}
          </h1>
        </div>

        <div className="d-flex align-items-center justify-content-end gap-2 flex-shrink-0">
          {children || <div style={{ width: 40 }} />}
        </div>
      </div>
    </header>
  );
};

export default PageHeader;
