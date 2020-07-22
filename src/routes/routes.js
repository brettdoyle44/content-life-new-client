import React, { useContext } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { Context } from '../context/store';
import App from '../App';
// import Signin from '../pages/SignIn';
// import Signup from '../components/Signup';
// import Analytics from '../pages/Analytics';
import Ideas from '../pages/Ideas';
// import Storyboards from '../pages/Storyboards';
// import Calendar from '../pages/Calendar';
// import AddIdea from '../components/AddIdea';
// import Idea from '../components/Idea';
// import EditIdea from '../components/EditIdea';
// import EditEvent from '../components/EditEvent';
// import Storyboard from '../components/Storyboard';

export default function Routes() {
  const { store } = useContext(Context);
  const PrivateRoute = ({ component: Component, ...rest }) => (
    <Route
      {...rest}
      render={(props) => store.isSignIn && <Component {...props} />}
    />
  );
  return (
    <Switch>
      {/* <PrivateRoute exact path="/analytics" component={Analytics} /> */}
      <PrivateRoute exact path="/ideas" component={Ideas} />
      {/* <PrivateRoute exact path="/storyboard" component={Storyboards} />
      <PrivateRoute exact path="/calendar" component={Calendar} />
      <PrivateRoute exact path="/addidea" component={AddIdea} />
      <PrivateRoute exact path="/ideas/:id" component={Idea} />
      <PrivateRoute exact path="/ideas/:id/edit" component={EditIdea} />
      <PrivateRoute exact path="/storyboard/:id" component={Storyboard} />
      <PrivateRoute exact path="/events/:id" component={EditEvent} /> */}
      <Route
        exact
        path="/"
        render={(props) => {
          return store.isSignIn && <Redirect {...props} to="/ideas" />;
        }}
      />
      <Route
        exact
        path="/signin"
        render={(props) => {
          return store.isSignIn && <Redirect {...props} to="/ideas" />;
        }}
      />
      {/* <Route exact path="/signup" component={Signup} /> */}
      {/* <Route exact path="/signin" component={Signin} /> */}
      <Route component={App} />
    </Switch>
  );
}
