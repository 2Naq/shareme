import React from 'react';
import Navbar from '@theme-original/Navbar';
import clsx from 'clsx';

export default function NavbarWrapper(props) {
  return (
    <>
      <Navbar {...props} className={clsx('navbar-glass', props.className)} />
    </>
  );
}
