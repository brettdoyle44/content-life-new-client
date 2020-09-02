import React, { useState, useEffect, useRef, useContext } from 'react';
import { Context } from '../../context/store';
import { useParams } from 'react-router-dom';
import { s3Upload } from '../../libs/awsLib';
import { Storage } from 'aws-amplify';
import TextareaAutosize from 'react-textarea-autosize';
import { API } from 'aws-amplify';
import { CircleSpinner } from 'react-spinners-kit';
import { PlusCircle, Save } from 'react-feather';
import {
  MainImage,
  ImageOverlay,
  UploadIcon,
  DeleteIcon,
  DeleteButton,
} from '../../styles/storyboard';
import '../../styles/input-control.css';

export default function Storyboard(props) {
  const file = useRef(null);
  const dragItem = useRef(null);
  const dragNode = useRef(null);
  const deleteItem = useRef(null);
  const { id } = useParams();
  const blankScene = {
    storyId: `${id}`,
    imagePath: '',
    image: '',
    script: '',
    actions: '',
  };
  const [scenes, setScenes] = useState([{ ...blankScene }]);
  const [isLoading, setIsLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const iconStyle = {
    width: '1em',
    marginRight: '5px',
    height: 'auto',
  };

  const { store } = useContext(Context);

  useEffect(() => {
    let didCancel = false;

    function loadScenes() {
      return API.get('core', `/boards/${id}`);
    }

    async function getImages(sceneObj) {
      for (const [, scene] of sceneObj.entries()) {
        if (scene.image) {
          const thePath = await Storage.vault.get(scene.image);
          scene.imagePath = thePath;
        } else {
          scene.imagePath = null;
        }
      }
      return sceneObj;
    }

    async function onLoad() {
      if (!store.isSignIn) {
        return;
      }
      try {
        const theScenes = await loadScenes();
        const initialObj = await getImages(theScenes);
        const finalObj = await initialObj.sort(function (a, b) {
          return a.idx - b.idx;
        });
        if (!didCancel) {
          setScenes(finalObj);
        }
      } catch (e) {
        console.error(e);
      }

      setIsLoading(false);
    }
    onLoad();
    return () => {
      didCancel = true;
    };
  }, [id, store.isSignIn]);

  function addScene() {
    return setScenes([...scenes, { ...blankScene }]);
  }

  function handleDragStart(e, params) {
    console.log(params);
    dragItem.current = params;
    dragNode.current = e.target;
    dragNode.current.addEventListener('dragend', handleDragEnd);
    setTimeout(() => {
      setDragging(true);
    }, 0);
  }

  function handleDragEnd() {
    console.log('drag ended');
    setDragging(false);
    dragNode.current.removeEventListener('dragend', handleDragEnd);
    dragNode.current = null;
    dragItem.current = null;
  }

  function handleDragEnter(e, params) {
    e.preventDefault();
    if (e.target !== dragNode.current) {
      console.log(dragItem.current);
      setScenes((oldScenes) => {
        let newScenes = JSON.parse(JSON.stringify(oldScenes));
        newScenes.splice(
          params.idx,
          0,
          newScenes.splice(dragItem.current.idx, 1)[0]
        );
        dragItem.current = params;
        console.log(newScenes);
        return newScenes;
      });
    }
  }

  function deleteBoard(id, storyId) {
    return API.del('core', `/board/${id}`, {
      body: { storyId },
    });
  }

  function reRenderScenes(id) {
    const updatedScenes = scenes.filter((scene) => scene.boardId !== id);
    setScenes(updatedScenes);
  }

  async function handleDelete(e, params) {
    e.preventDefault();
    deleteItem.current = params;
    const confirmed = window.confirm(
      'Are you sure you want to delete this board?'
    );
    if (!confirmed) {
      return;
    }
    setIsDeleting(true);
    try {
      if (deleteItem.current.scene.image) {
        await Storage.vault.remove(deleteItem.current.scene.image);
        await deleteBoard(
          deleteItem.current.scene.boardId,
          deleteItem.current.scene.storyId
        );
        reRenderScenes(deleteItem.current.scene.boardId);
        setIsDeleting(false);
      } else {
        await deleteBoard(
          deleteItem.current.scene.boardId,
          deleteItem.current.scene.storyId
        );
        reRenderScenes(deleteItem.current.scene.boardId);
        setIsDeleting(false);
      }
    } catch (e) {
      console.error(e);
      setIsDeleting(false);
    }
  }

  async function handleSceneChange(e) {
    e.persist();
    const updateScenes = [...scenes];
    try {
      if (e.target.className.split(' ')[0] === 'image' && e.target.files[0]) {
        file.current = e.target.files[0];
        if (updateScenes[e.target.dataset.idx].image) {
          console.log('replace image upload');
          await Storage.vault.remove(updateScenes[e.target.dataset.idx].image);
        }
        console.log('new image upload');
        const theImageShort = await s3Upload(file.current);
        const theImageLong = await Storage.vault.get(theImageShort);
        updateScenes[e.target.dataset.idx].image = theImageShort;
        updateScenes[e.target.dataset.idx].imagePath = theImageLong;
        setScenes(updateScenes);
      } else if (e.target.className.split(' ')[0] === 'script' || 'actions') {
        updateScenes[e.target.dataset.idx][e.target.className.split(' ')[0]] =
          e.target.value;
        setScenes(updateScenes);
      }
    } catch (e) {
      console.error(e);
    }
  }

  async function handleSaveBoards(e) {
    e.preventDefault();
    setSaveLoading(true);
    for (const [idx, scene] of scenes.entries()) {
      if (!scene.boardId) {
        scene.idx = idx;
        await API.post('core', '/boards', {
          body: scene,
        });
      } else {
        scene.idx = idx;
        console.log(scene);
        await API.put('core', `/board/${scene.boardId}`, {
          body: scene,
        });
      }
    }
    setSaveLoading(false);
  }

  function handleUploadClick(e) {
    e.preventDefault();
    document.getElementById(`${e.target.dataset.idx}-hiddenFileInput`).click();
  }

  function renderSceneList(scenes) {
    return scenes.map((scene, idx) =>
      scene !== [] ? (
        <div
          className="col-sm-12 col-md-6 col-lg-6 col-xl-4"
          onDragStart={(e) => {
            handleDragStart(e, { scene, idx });
          }}
          onDragEnter={
            dragging
              ? (e) => {
                  handleDragEnter(e, { scene, idx });
                }
              : null
          }
          onDragOver={(e) => {
            e.preventDefault();
          }}
          draggable
          key={idx}
          index={idx}
          type="card"
        >
          <div className="card p-0">
            <div className="overlay-card">
              <MainImage className="border-bottom" img={scene.imagePath}>
                <input
                  name={`file-${idx}`}
                  type="file"
                  onChange={handleSceneChange}
                  data-idx={idx}
                  className="image"
                  style={{ display: 'none' }}
                  id={`${idx}-hiddenFileInput`}
                />
                <ImageOverlay data-idx={idx} onClick={handleUploadClick}>
                  <UploadIcon />{' '}
                  {scene.imagePath ? 'Replace Image' : 'New Image'}
                </ImageOverlay>
                <DeleteButton
                  onClick={(e) => {
                    handleDelete(e, { scene });
                  }}
                >
                  {!isDeleting ? (
                    <>
                      <DeleteIcon />
                    </>
                  ) : (
                    <>
                      <CircleSpinner size={10} />
                    </>
                  )}
                </DeleteButton>
              </MainImage>
            </div>
            <div className="">
              <div className="border-bottom">
                <label className="text-uppercase pl-10 pt-10" htmlFor="script">
                  Script
                </label>
                <TextareaAutosize
                  placeholder="Start script here..."
                  async
                  name={`script-${idx}`}
                  className="script input-control text-muted"
                  data-idx={idx}
                  id="script"
                  value={scenes[idx].script}
                  onChange={handleSceneChange}
                />
              </div>
              <div className="">
                <label className="text-uppercase pl-10 pt-10">Actions</label>
                <TextareaAutosize
                  placeholder="Start action here..."
                  async
                  name={`script-${idx}`}
                  className="actions input-control text-muted"
                  data-idx={idx}
                  value={scenes[idx].actions}
                  onChange={handleSceneChange}
                />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div>Nothing here</div>
      )
    );
  }

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center px-20 pt-10">
        <p className="text-uppercase font-weight-bolder">
          {props.location.state.title}
        </p>
        <button
          className="btn btn-primary d-flex justify-content-between align-items-center"
          onClick={handleSaveBoards}
        >
          {!saveLoading ? (
            <>
              <Save style={iconStyle} />
              Save Board
            </>
          ) : (
            <>
              <CircleSpinner size={10} />{' '}
              <span style={{ marginLeft: '5px' }}>Saving...</span>
            </>
          )}
        </button>
      </div>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <div className="row">
          <>{renderSceneList(scenes)}</>
          <div className="col-sm-12 col-md-6 col-lg-6 col-xl-4">
            <div
              className="card add-scene p-0 h-300 d-flex justify-content-center align-items-center"
              onClick={addScene}
            >
              <PlusCircle />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
