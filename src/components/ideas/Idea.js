import React, { useEffect, useState, useContext } from 'react';
import { Context } from '../../context/store';
import { useHistory, Link, useParams } from 'react-router-dom';
import { API, Storage } from 'aws-amplify';
import moment from 'moment';
import { CircleSpinner } from 'react-spinners-kit';
import {
  Calendar,
  Paperclip,
  Activity,
  Layout,
  Edit,
  Trash2,
} from 'react-feather';

export default function Idea() {
  const history = useHistory();
  const params = useParams();
  const [idea, setIdea] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentAttachments, setCurrentAttachments] = useState('');
  const [currentShortname, setCurrentShortname] = useState('');
  //   const [deleteConfirm, setDeleteConfirm] = useState(false);
  const { store } = useContext(Context);

  const iconStyle = {
    width: '1.25em',
    marginRight: '5px',
    height: 'auto',
  };

  const buttonIconStyle = {
    width: '1.25em',
    marginRight: '5px',
    height: 'auto',
  };

  useEffect(() => {
    function loadIdea() {
      return API.get('core', `/ideas/${params.id}`);
    }

    async function onLoad() {
      if (!store.isSignIn) {
        return;
      }
      try {
        const idea = await loadIdea();
        if (idea.attachments.SS[0]) {
          const currentAttachment = await Storage.vault.get(
            idea.attachments.SS[0]
          );
          setCurrentAttachments(currentAttachment);
        }
        setCurrentShortname(idea.attachments.SS[0]);
        setIdea(idea);
      } catch (e) {
        console.error(e);
      }
    }

    onLoad();
  }, [params.id, store.isSignIn]);

  function deleteIdea() {
    return API.del('core', `/ideas/${params.id}`);
  }

  async function handleDelete(event) {
    event.preventDefault();
    const confirmed = window.confirm(
      'Are you sure you want to delete this idea?'
    );
    if (!confirmed) {
      return;
    }
    setIsDeleting(true);
    try {
      if (idea.attachments) {
        await Storage.vault.remove(idea.attachments.SS[0]);
        await deleteIdea();
        history.push('/ideas');
      } else {
        await deleteIdea();
        history.push('/ideas');
      }
    } catch (e) {
      console.error(e);
      setIsDeleting(false);
    }
  }

  return (
    <>
      {idea ? (
        <div className="container-fluid">
          <div className="d-flex justify-content-between align-items-center px-20 pt-10">
            <p className="text-uppercase font-weight-bolder">{idea.header}</p>
            <div className="d-flex flex-row justify-content-center align-items-center">
              <Link
                style={{ textDecoration: 'none' }}
                to={`/ideas/${params.id}/edit`}
              >
                <button className="btn btn-primary d-flex justify-content-between align-items-center mr-10">
                  <Edit style={buttonIconStyle} />
                  Edit
                </button>
              </Link>
              <button
                onClick={handleDelete}
                className="btn btn-danger d-flex justify-content-between align-items-center"
              >
                {!isDeleting ? (
                  <>
                    <Trash2 style={buttonIconStyle} />
                    Delete
                  </>
                ) : (
                  <>
                    <CircleSpinner size={10} />{' '}
                    <span style={{ marginLeft: '5px' }}>Deleting...</span>
                  </>
                )}
              </button>
            </div>
          </div>
          <div className="row">
            <div className="col-12">
              <div className="card">
                <div>
                  <h4>Details</h4>
                  <div>
                    <p>{idea.details}</p>
                  </div>
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <p className="d-flex align-items-center text-uppercase font-weight-bold">
                        <Calendar style={iconStyle} />
                        Target Date
                      </p>
                      <p>{moment(idea.targetDate).format('DD MMM, YYYY')}</p>
                    </div>
                    <div>
                      <p className="d-flex align-items-center text-uppercase font-weight-bold">
                        <Layout style={iconStyle} />
                        Platform
                      </p>
                      <p>{idea.platform}</p>
                    </div>
                    <div>
                      <p className="d-flex align-items-center text-uppercase font-weight-bold">
                        <Activity style={iconStyle} />
                        Status
                      </p>
                      <p>{idea.currentStatus}</p>
                    </div>
                  </div>
                  <div>
                    <p className="d-flex align-items-center font-weight-bold text-uppercase">
                      <Paperclip style={iconStyle} />
                      Attached Files
                    </p>
                    {currentAttachments ? (
                      <>
                        <img
                          width="50"
                          src={currentAttachments}
                          alt={idea.header}
                        />
                        <p>{currentShortname}</p>
                      </>
                    ) : (
                      <p>None</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </>
  );
}
