import { SidebarTrigger } from "../ui/sidebar";

export function Header() {
  return (
    <header className='sticky top-0 z-20 w-full border-b bg-white shadow-sm'>
      <div className='container mx-auto flex h-14 items-center px-4 sm:px-6 lg:px-8'>
        <SidebarTrigger />
        <div className='ml-4 hidden md:flex'></div>
      </div>
    </header>
  );
}
