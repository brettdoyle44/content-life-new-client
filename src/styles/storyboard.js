import styled from 'styled-components';
import { PlusCircle, Upload, Save, Trash2 } from 'react-feather';
import noImage from '../images/No-Image.png';
import TextareaAutosize from 'react-textarea-autosize';

export const UploadIcon = styled(Upload)`
  width: 1em;
  height: auto;
  color: #fff;
  margin-right: 5px;
`;

export const DeleteIcon = styled(Trash2)`
  width: 1em;
  height: auto;
  color: #fff;
`;

export const DeleteButton = styled.button`
  border: none;
  background-color: #ff5959;
  border-radius: 0.5em;
  color: #fff;
  padding: 1em;
  cursor: pointer;
  display: none;
  margin-left: 5px;
  &:hover {
    opacity: 0.9;
  }
`;

export const ImageOverlay = styled.button`
  border: none;
  background-color: #4f9da6;
  border-radius: 0.5em;
  color: #fff;
  padding: 1em 2em;
  cursor: pointer;
  display: none;
  &:hover {
    opacity: 0.9;
  }
`;

export const MainImage = styled.div`
  flex-grow: 1;
  height: 15em;
  background: url(${(props) => (props.img ? props.img : noImage)});
  border-radius: 0.2em 0.2em 0 0;
  background-size: cover;
  background-position: center center;
  background-repeat: no-repeat;
  display: flex;
  justify-content: center;
  align-items: center;
  &:hover {
    cursor: grab;
  }
  &:active {
    cursor: grabbing;
  }
  &:hover ${ImageOverlay} {
    display: flex;
  }
  &:hover ${DeleteButton} {
    display: flex;
  }
`;
