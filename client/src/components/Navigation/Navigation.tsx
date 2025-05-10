import { Link } from 'react-router-dom';
import styled from 'styled-components';
import logo from '../../images/logo.png';

export const Navigation = () => {
  return (
    <Wrapper>
      <img src={logo} alt="Logo" />
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/content-items">Content Items</Link>
        </li>
        <li>
          <Link to="/episodes">Episodes</Link>
        </li>
      </ul>
    </Wrapper>
  );
};

const Wrapper = styled.nav`
  background-color: #0c0c0c;
  padding: 10px;
  display: flex;
  gap: 30px;
  align-items: center;
  font-family: 'Denike';
  border-bottom: 2px solid #ff6642;

  img {
    width: 100px;
    height: 100px;
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: row;
    gap: 30px;

    li {
      border: 1px solid transparent;
      border-radius: 8px;
      padding: 10px;
      cursor: pointer;

      a {
        color: #dbdbdb;
        text-decoration: none;
        font-size: 24px;
        line-height: 30px;
      }

      &:hover {
        border: 1px solid #ff6642;
      }
    }
  }
`;
