import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import { loadingComplete, setLoading } from '../../redux/userReducers';
import { useParams } from 'react-router-dom';
import CustomForm1 from '../../components/CustomForm1';
import axios from 'axios';

const update = () => {
  const [job, setJob] = useState([]);
  const dispatch = useDispatch();
  const params = useParams();
  useEffect(() => {
    const fetch = async () => {
      dispatch(setLoading());
      const response = await axios.get(import.meta.env.VITE_SERVER_URL + `/api/job/${params.id}/show`);
      if (response.data.success) {
        setJob(response.data.job);
      }
      dispatch(loadingComplete());
    };
    fetch();
  }, [])

  return (
    <CustomForm1 type='Job' JOB={job} />
  )
}

export default update
