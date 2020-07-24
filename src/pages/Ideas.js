import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Paperclip, Calendar, PlusCircle } from 'react-feather';
import { Context } from '../context/store';
import { API } from 'aws-amplify';
import moment from 'moment';
import '../styles/overlay.css';

export default function Ideas() {
  const [ideas, setIdeas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const MAX_LENGTH = 150;

  const iconStyle = {
    width: '1em',
    marginRight: '5px',
    height: 'auto',
  };

  const { store } = useContext(Context);

  useEffect(() => {
    async function onLoad() {
      if (!store.isSignIn) {
        return;
      }
      try {
        const ideas = await loadIdeas();
        setIdeas(ideas);
      } catch (e) {
        console.error(e);
      }

      setIsLoading(false);
    }

    onLoad();
  }, [store.isSignIn]);

  function loadIdeas() {
    return API.get('core', '/ideas');
  }

  function renderIdeaList(ideas) {
    return ideas.map((idea) =>
      idea !== [] ? (
        <div className="col-sm-12 col-md-6 col-lg-6 col-xl-4" key={idea.ideaId}>
          <div className="card overlay-card">
            <div className="card-overlay">
              <div className="overlay-details fadeIn-top">
                <Link
                  to={`/ideas/${idea.ideaId}`}
                  style={{ textDecoration: 'none' }}
                >
                  <button className="btn btn-primary">View Idea</button>
                </Link>
              </div>
            </div>
            <div className="d-flex justify-content-between align-items-center">
              <p
                className={`text-uppercase ${
                  idea.currentStatus === 'New' ? 'text-primary' : ''
                } ${idea.currentStatus === 'Updated' ? 'text-secondary' : ''} ${
                  idea.currentStatus === 'Launched' ? 'text-success' : ''
                }`}
              >
                {idea.platform}
              </p>
              <div>
                <span
                  className={`badge ${
                    idea.currentStatus === 'New' ? 'badge-primary' : ''
                  } ${
                    idea.currentStatus === 'Updated' ? 'badge-secondary' : ''
                  } ${
                    idea.currentStatus === 'Launched' ? 'badge-success' : ''
                  }`}
                >
                  {idea.currentStatus}
                </span>
              </div>
            </div>

            <p>
              {idea.details
                .replace(/<\/?[^>]+(>|$)/g, '')
                .substring(0, MAX_LENGTH)}
              ...
            </p>
            <div className="d-flex justify-content-between align-items-center">
              <p className="d-flex align-items-center">
                <Paperclip style={iconStyle} /> {idea.attachments.SS.length}
              </p>
              <p className="d-flex align-items-center">
                <Calendar style={iconStyle} />{' '}
                {moment(idea.targetDate).format('DD MMM')}
              </p>
            </div>
          </div>
          {/* </Link> */}
        </div>
      ) : (
        <div>Nothing here</div>
      )
    );
  }

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center px-20 pt-10">
        <p className="text-uppercase font-weight-bolder">Ideas</p>
        <Link to="/addidea">
          <button className="btn btn-primary d-flex justify-content-between align-items-center">
            <PlusCircle style={iconStyle} />
            Add New Idea
          </button>
        </Link>
      </div>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <div className="row">{renderIdeaList(ideas)}</div>
      )}
    </div>
  );
}
