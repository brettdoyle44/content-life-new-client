import React, { useState, useRef, forwardRef, useEffect } from 'react';
import { X } from 'react-feather';
import { Link, useHistory, useParams } from 'react-router-dom';
import { s3Upload } from '../../libs/awsLib';
import moment from 'moment';
import DatePicker from 'react-datepicker';
import { API, Storage } from 'aws-amplify';
import config from '../../config';
import 'react-datepicker/dist/react-datepicker.css';

export default function EditIdea() {
  const file = useRef(null);
  const { id } = useParams();
  const history = useHistory();
  const [header, setHeader] = useState('');
  const [details, setDetails] = useState('');
  const [platform, setPlatform] = useState('');
  const [targetDate, setTargetDate] = useState(moment());
  //   const [attachments, setAttachments] = useState('');
  const [currentAttachments, setCurrentAttachments] = useState('');
  const [currentShortname, setCurrentShortname] = useState('');
  const [collaborators, setCollaborators] = useState([]);
  const [doneLoading, setDoneLoading] = useState(false);

  const iconStyle = {
    width: '1em',
    height: 'auto',
  };

  useEffect(() => {
    function loadIdea() {
      return API.get('core', `/ideas/${id}`);
    }

    async function onLoad() {
      try {
        const idea = await loadIdea();

        if (idea.attachments.SS[0]) {
          const currentAttachment = await Storage.vault.get(
            idea.attachments.SS[0]
          );
          setCurrentAttachments(currentAttachment);
        }
        setCurrentShortname(idea.attachments.SS[0]);
        setHeader(idea.header);
        setDetails(idea.details);
        setPlatform(idea.platform);
        setTargetDate(moment(idea.targetDate).toDate());
        setCollaborators(['']);
        setDoneLoading(true);
      } catch (e) {
        console.error(e);
      }
    }

    onLoad();
  }, [id]);

  const CalendarInput = forwardRef(({ onClick, value }, ref) => (
    <button className="btn" onClick={onClick} ref={ref}>
      {value}
    </button>
  ));

  function handleFileChange(event) {
    file.current = event.target.files[0];
    setCurrentShortname(file.current.name);
  }

  function saveIdea(idea) {
    return API.put('core', `/ideas/${id}`, {
      body: idea,
    });
  }

  async function handleSubmit(event) {
    let attachment;

    event.preventDefault();

    if (file.current && file.current.size > config.MAX_ATTACHMENT_SIZE) {
      alert(
        `Please pick a file smaller than ${
          config.MAX_ATTACHMENT_SIZE / 1000000
        } MB.`
      );
      return;
    }

    try {
      if (file.current) {
        attachment = await s3Upload(file.current);
        setCurrentShortname(attachment);
      }
      await saveIdea({
        header,
        details,
        targetDate,
        currentStatus: 'Updated',
        platform,
        attachments: [attachment] || [currentShortname],
        collaborators,
      });
      history.push(`/ideas/${id}`);
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <>
      {doneLoading ? (
        <div className="container-fluid">
          <div className="d-flex justify-content-between align-items-center px-20 pt-10">
            <p className="text-uppercase font-weight-bolder">Edit Your Idea</p>
            <Link to="/ideas">
              <button className="btn btn-danger d-flex justify-content-between align-items-center">
                <X style={iconStyle} />
              </button>
            </Link>
          </div>
          <div className="row">
            <div className="col-12">
              <div className="card">
                <form>
                  <div className="form-group">
                    <input
                      type="text"
                      className="form-control"
                      id="title"
                      placeholder="Title"
                      required="required"
                      value={header}
                      onChange={(e) => setHeader(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <input
                      type="text"
                      className="form-control"
                      id="platform"
                      placeholder="Main platform idea is for (Youtube, Instagram)..."
                      required="required"
                      value={platform}
                      onChange={(e) => setPlatform(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <textarea
                      className="form-control"
                      id="description"
                      placeholder="Write down your idea..."
                      value={details}
                      onChange={(e) => setDetails(e.target.value)}
                    ></textarea>
                  </div>

                  <div className="form-group">
                    <DatePicker
                      selected={targetDate}
                      onChange={(date) => setTargetDate(date)}
                      customInput={<CalendarInput />}
                    />
                  </div>

                  <div className="form-group">
                    <div className="custom-file">
                      <input
                        name="file"
                        type="file"
                        id="picture"
                        required="required"
                        onChange={handleFileChange}
                      />
                      <label htmlFor="picture">
                        {currentShortname
                          ? currentShortname
                          : 'Choose attachment'}
                      </label>
                    </div>
                    <div>
                      {currentAttachments && (
                        <img width="50" src={currentAttachments} alt={header} />
                      )}
                    </div>
                  </div>

                  <input
                    className="btn btn-primary"
                    type="submit"
                    value="Submit"
                    onClick={handleSubmit}
                  />
                </form>
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
