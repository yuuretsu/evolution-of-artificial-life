import styled from 'styled-components';
import { MdDownload } from 'react-icons/md';
import { IconContext } from 'react-icons';


const Button = styled.button`
  position: fixed;
  display: flex;
  align-items: center;
  gap: 10px;
  background-color: rgb(80, 80, 80);
  border: none;
  border-radius: 500px;
  padding: 10px 20px;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  white-space: nowrap;
  text-transform: uppercase;
  color: white;
  font-weight: bold;
  font-size: 1.25em;

  cursor: pointer;

  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
  transition-duration: 0.2s;

  &:active {
    box-shadow: none;
    background-color: rgb(60, 60, 60);
  }
`;

export const PwaUpdateButton = () => {
  const handleClickUpdate = () => {
    // location.reload();

    if (window.matchMedia('(display-mode: standalone)').matches) {
      alert('PWA запущено в автономном режиме (standalone)');
    } else {
      alert('PWA запущено в браузере');
    }
  };
  return (
    <IconContext.Provider value={{ size: '25' }}>
      <Button onClick={handleClickUpdate}>
        <MdDownload />
        обновить
      </Button>
    </IconContext.Provider>
  );
};
