import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { API } from 'aws-amplify';
import halfmoon from 'halfmoon';
import { Save } from 'react-feather';
import { CircleSpinner } from 'react-spinners-kit';

export default function AddStoryModal() {
  const history = useHistory();
  const [header, setHeader] = useState('');
  const [details, setDetails] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const iconStyle = {
    width: '1em',
    marginRight: '5px',
    height: 'auto',
  };

  useEffect(() => {
    halfmoon.onDOMContentLoaded();
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    setIsCreating(true);
    try {
      const theStory = await createStoryboard({
        header,
        details,
      });
      halfmoon.toggleModal('add-story-modal');
      setDetails('');
      setHeader('');
      setIsCreating(false);
      history.push({
        pathname: `/storyboard/${theStory.storyId}`,
        state: { title: theStory.header, newStory: true },
      });
    } catch (e) {
      alert(e.message);
    }
  }

  function createStoryboard(story) {
    return API.post('core', '/stories', {
      body: story,
    });
  }
  return (
    <div className="modal" tabIndex="-1" role="dialog" id="add-story-modal">
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <h5 class="modal-title">Create your storyboard</h5>
          <form>
            <div className="form-group">
              <input
                type="text"
                id="username"
                className="form-control"
                placeholder="Title Here"
                required="required"
                value={header}
                onChange={(e) => setHeader(e.target.value)}
              />
            </div>
            <div className="form-group">
              <textarea
                className="form-control"
                id="description"
                placeholder="Describe your story..."
                value={details}
                onChange={(e) => setDetails(e.target.value)}
              ></textarea>
            </div>
            <button
              className="btn btn-primary w-full d-flex justify-content-center align-items-center"
              onClick={handleSubmit}
            >
              {!isCreating ? (
                <>Create Story</>
              ) : (
                <>
                  <CircleSpinner size={10} />{' '}
                  <span style={{ marginLeft: '5px' }}>Creating...</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
