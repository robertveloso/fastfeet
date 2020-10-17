import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { NavLink } from 'react-router-dom';

import { Container, Content, Navigation, Profile } from './styles';
import { signOut } from '~/store/modules/auth/actions';

import logo from '~/assets/logo.svg';

export default function Header() {
  const dispatch = useDispatch();
  const profile = useSelector(state => state.user.profile);

  function handleSingOut() {
    dispatch(signOut());
  }

  return (
    <Container>
      <Content>
        <nav>
          <NavLink to="/pedidos">
            <img src={logo} alt="FastFeet" />
          </NavLink>
          <Navigation>
            <NavLink to="/pedidos">PEDIDOS</NavLink>
            <NavLink to="/entregadores">ENTREGADORES</NavLink>
            <NavLink to="/clientes">CLIENTES</NavLink>
            <NavLink to="/estoque">ESTOQUE</NavLink>
            <NavLink to="/produtos">PRODUTOS</NavLink>
            {/* <NavLink to="/problems">PROBLEMAS</NavLink> */}
          </Navigation>
        </nav>

        <aside>
          <Profile>
            <strong>{profile?.name}</strong>
            <button type="button" onClick={handleSingOut}>
              sair do sistema
            </button>
          </Profile>
        </aside>
      </Content>
    </Container>
  );
}
