import React, { useState, useRef, forwardRef } from 'react';
import { X } from 'react-feather';
import { Link, useHistory } from 'react-router-dom';
import { s3Upload } from '../../libs/awsLib';
import moment from 'moment';
import DatePicker from 'react-datepicker';
import { API } from 'aws-amplify';
import config from '../../config';
// import styled from 'styled-components';
import 'react-datepicker/dist/react-datepicker.css';

// const DatePickerInput = styled(DatePicker)`
//   width: 100%;
//   border-radius: 0.5em;
//   border: 1px solid #d1d8e0;
//   padding: 1em 1.5em;
//   margin-bottom: 2%;
//   ouline: 0px;
//   &:focus {
//     outline: none;
//     border-color: #4f9da6;
//   }
// `;

export default function AddIdea() {
  const file = useRef(null);
  const history = useHistory();
  const [header, setHeader] = useState('');
  const [details, setDetails] = useState('');
  const [platform, setPlatform] = useState('');
  const [targetDate, setTargetDate] = useState(moment().valueOf());
  const [attachments, setAttachments] = useState('');
  const [collaborators, setCollaborators] = useState([]);

  const iconStyle = {
    width: '1em',
    height: 'auto',
  };

  const CalendarInput = forwardRef(({ onClick, value }, ref) => (
    <button className="btn" onClick={onClick} ref={ref}>
      {value}
    </button>
  ));

  function handleFileChange(event) {
    file.current = event.target.files[0];
    setAttachments(file.current.name);
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (file.current && file.current.size > config.MAX_ATTACHMENT_SIZE) {
      alert(
        `Please pick a file smaller than ${
          config.MAX_ATTACHMENT_SIZE / 1000000
        } MB.`
      );
      return;
    }
    // setIsLoading(true);
    try {
      const attachment = file.current ? await s3Upload(file.current) : null;
      setCollaborators(['']);
      await createIdea({
        header,
        details,
        platform,
        currentStatus: 'New',
        targetDate,
        attachments: [attachment],
        collaborators,
      });
      history.push('/ideas');
    } catch (e) {
      alert(e.message);
    }
  }

  function createIdea(idea) {
    return API.post('core', '/ideas', {
      body: idea,
    });
  }

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center px-20 pt-10">
        <p className="text-uppercase font-weight-bolder">Add New Idea</p>
        <Link to="/ideas">
          <button className="btn btn-danger d-flex justify-content-between align-items-center">
            <X style={iconStyle} />
          </button>
        </Link>
      </div>
      <div className="row">
        <div className="col-12">
          <div className="card">
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <input
                  type="text"
                  className="form-control"
                  id="title"
                  placeholder="Title"
                  required="required"
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
                  onChange={(e) => setPlatform(e.target.value)}
                />
              </div>

              <div className="form-group">
                <textarea
                  className="form-control"
                  id="description"
                  placeholder="Write down your idea..."
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
                    {attachments ? attachments : 'Choose attachment'}
                  </label>
                </div>
              </div>

              <input className="btn btn-primary" type="submit" value="Submit" />
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
