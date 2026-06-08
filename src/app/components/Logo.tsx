import { useNavigate } from 'react-router';
import kidioLogo from 'figma:asset/kidio-logo.png';

export function Logo() {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate('/')}
      className="hover:opacity-80 transition-opacity"
    >
      <img src={kidioLogo} alt="Kidio Learning" className="h-12 w-auto" />
    </button>
  );
}
