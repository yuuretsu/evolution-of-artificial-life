import { useUnit } from 'effector-react';
import { $isSidebarOpen } from 'entities/sidebar';
import { setSidebarIsOpen } from 'features/set-sidebar-is-open';
import { MdClose, MdMenu } from 'react-icons/md';
import { RoundedToggle } from 'shared/ui';

export const ToggleSidebar = () => {
  const u = useUnit({
    isSidebarOpen: $isSidebarOpen,
    setSidebarIsOpen,
  });

  return (
    <RoundedToggle
      title="Настройки"
      slotA={<MdClose />}
      slotB={<MdMenu />}
      isA={u.isSidebarOpen}
      onChange={u.setSidebarIsOpen}
    />
  );
};
