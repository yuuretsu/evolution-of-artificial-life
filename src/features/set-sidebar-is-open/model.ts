import { createEvent } from 'effector';
import { $isSidebarOpen } from 'entities/sidebar';

export const setSidebarIsOpen = createEvent<boolean>();

$isSidebarOpen.on(setSidebarIsOpen, (_, value) => value);
