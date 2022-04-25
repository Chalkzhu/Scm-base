import React from 'react';

import Headerr from './Header';
import Aside from './Aside';
import Main from './Main';
// import Footer from './Footer';

import Sty from './index.module.less';

const Layout = () => {
  return (
    <div className={Sty.init}>
      <Aside />
      <section className={Sty.main_box}>
        <Headerr />
        <Main />
        {/* <Footer /> */}
      </section>
    </div>
  )
};
export default Layout;

