import React, { useEffect, useState, useContext, useRef } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle } from 'react-feather';
import { Context } from '../context/store';
import { API, Storage } from 'aws-amplify';
import moment from 'moment';
import halfmoon from 'halfmoon';
import { MainImage } from '../styles/storyboard';
import defaultImage from '../images/No-Image.png';
import { CircleSpinner } from 'react-spinners-kit';
import { ImageOverlay, DeleteIcon, DeleteButton } from '../styles/storyboard';
import '../styles/overlay.css';

export default function Storyboards() {
  const deleteItem = useRef(null);
  const [storyboards, setStoryboards] = useState([]);
  const [mainImages, setMainImages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  const iconStyle = {
    width: '1em',
    marginRight: '5px',
    height: 'auto',
  };

  const { store } = useContext(Context);

  useEffect(() => {
    halfmoon.onDOMContentLoaded();
    async function getImages(storyboards) {
      let finalObj = [];
      for (const [, storyboard] of storyboards.entries()) {
        const theImage = await loadScene(storyboard.storyId);
        if (theImage[0] === undefined) {
          finalObj.push(null);
        } else {
          const thePath = await Storage.vault.get(theImage[0].image);
          finalObj.push(thePath);
        }
      }
      return finalObj;
    }

    async function onLoad() {
      if (!store.isSignIn) {
        return;
      }
      try {
        const storyboards = await loadStoryboards();
        const mainImage = await getImages(storyboards);
        setMainImages(mainImage);
        setStoryboards(storyboards);
      } catch (e) {
        console.error(e);
      }

      setIsLoading(false);
    }
    onLoad();
  }, [store.isSignIn]);

  function loadScene(id) {
    return API.get('core', `/boards/${id}`);
  }

  function loadStoryboards() {
    return API.get('core', '/stories');
  }

  function popAddStoryModal() {
    halfmoon.toggleModal('add-story-modal');
  }

  function deleteStory(id) {
    return API.del('core', `/story/${id}`);
  }

  function reRenderScenes(id) {
    const updatedStories = storyboards.filter(
      (storyboard) => storyboard.storyId !== id
    );
    setStoryboards(updatedStories);
  }

  async function handleDelete(e, params) {
    e.preventDefault();
    deleteItem.current = params;
    const confirmed = window.confirm(
      'Are you sure you want to delete this idea?'
    );
    if (!confirmed) {
      return;
    }
    setIsDeleting(true);
    try {
      await deleteStory(deleteItem.current.storyboard.storyId);
      reRenderScenes(deleteItem.current.storyboard.storyId);
      setIsDeleting(false);
    } catch (e) {
      console.error(e);
      setIsDeleting(false);
    }
  }

  function renderStoryList(storyboards) {
    return storyboards.map((storyboard, idx) =>
      storyboard !== [] ? (
        <div
          className="col-sm-12 col-md-6 col-lg-6 col-xl-4"
          key={storyboard.storyId}
        >
          <div className="card p-0">
            <div className="overlay-card">
              <MainImage
                className="border-bottom"
                img={mainImages[idx] ? mainImages[idx] : defaultImage}
              >
                <Link
                  to={{
                    pathname: `/storyboard/${storyboard.storyId}`,
                    state: {
                      title: storyboard.header,
                    },
                  }}
                  style={{ textDecoration: 'none' }}
                >
                  <ImageOverlay>View Storyboard</ImageOverlay>
                </Link>
                <DeleteButton
                  onClick={(e) => {
                    handleDelete(e, { storyboard });
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
            <div className="content">
              <h2 className="content-title">{storyboard.header}</h2>
              <p className="text-muted">{storyboard.details}</p>
              <p className="text-primary">
                Created: {moment(storyboard.createdAt).format('MMMM Do YYYY')}
              </p>
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
        <p className="text-uppercase font-weight-bolder">Storyboards</p>
        <button
          onClick={popAddStoryModal}
          className="btn btn-primary d-flex justify-content-between align-items-center"
        >
          <PlusCircle style={iconStyle} />
          New Storyboard
        </button>
      </div>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <div className="row">{renderStoryList(storyboards)}</div>
      )}
    </div>
  );
}
