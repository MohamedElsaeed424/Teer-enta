import "./index.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DeleteUser from './components/deleteUser.js';
import AddTourismGovernor from './components/addTourismGovernor.js';
import AddAdmin from './components/addAdmin.js';
import CreateCategory from './components/CRUDactivitycategory/addActivityCategory.js';
import DeleteActivityCategory from './components/CRUDactivitycategory/deleteActivityCategory.js';
import ViewActivityCategories from './components/CRUDactivitycategory/viewActivityCategory.js';
import UpdateActivityCategory from './components/CRUDactivitycategory/updateActivityCategory.js';
import { Toaster } from 'react-hot-toast';
import Signup from './screens/signup/Signup.js';
import Login from './screens/login/login.js';
import Profile from './screens/profile/profile.js';
import CreateActivity from './components/CRUDactivity/createActivity.js';
import ViewActivities from './components/CRUDactivity/viewActivity.js';
import UpdateActivity from './components/CRUDactivity/updateActivity.js';
import DeleteActivity from './components/CRUDactivity/deleteActivity.js';
import CreateTag from './components/CRUDtag/createTag.js';
import ViewTags from './components/CRUDtag/viewTag.js';
import UpdateTag from './components/CRUDtag/updateTag.js';
import DeleteTag from './components/CRUDtag/deleteTag.js';
import TouristWelcome from "./screens/TouristWelcome.jsx";
import ReadHistoriaclPlaces from './components/historicalPlaces/readHistoriaclPlaces.jsx';
import CreateHistoricalPlaces from './components/historicalPlaces/createHistoricalPlaces.jsx';
import UpdateHistoricalPlaces from './components/historicalPlaces/updateHistoriaclPlaces.jsx';
import DeleteHistoricalPlaces from './components/historicalPlaces/deleteHistoriaclPlaces.jsx';
function App() {
  return (
    <div className="App">
      <Router>
        <Routes>

          <Route path="/" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/delete-user" element={<DeleteUser />} />
          <Route path="/add-tourism-governor" element={<AddTourismGovernor />} />
          <Route path="/add-admin" element={<AddAdmin />} />
          <Route path="/create-activity-category" element={<CreateCategory />} />
          <Route path="/delete-activity-category" element={<DeleteActivityCategory />} />
          <Route path="/view-activity-categories" element={<ViewActivityCategories />} />
          <Route path="/update-activity-category" element={<UpdateActivityCategory />} />
          <Route path="/create-activity" element={<CreateActivity />} />
          <Route path="/view-activities" element={<ViewActivities />} />
          <Route path="/update-activity" element={<UpdateActivity />} />
          <Route path="/delete-activity" element={<DeleteActivity />} />
          <Route path="/create-tag" element={<CreateTag />} />
          <Route path="/view-tags" element={<ViewTags />} />
          <Route path="/update-tag" element={<UpdateTag />} />
          <Route path="/delete-tag" element={<DeleteTag />} />
          <Route path="/historicalPlace" element={<ReadHistoriaclPlaces />} />
          <Route path="/historicalPlace/create" element={<CreateHistoricalPlaces />} />
          <Route path="/historicalPlace/update/:id" element={<UpdateHistoricalPlaces />} />
          <Route path="/historicalPlace/delete/:id" element={<DeleteHistoricalPlaces />} />
        </Routes>
        <Toaster />
      </Router>
    </div>
  );
}

export default App;
