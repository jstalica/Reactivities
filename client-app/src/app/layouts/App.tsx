import React, { Fragment, useEffect } from 'react';
import NavBar from './NavBar';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard'
import { observer } from 'mobx-react-lite';
import { Container } from 'semantic-ui-react';
import { Route, Switch, useLocation } from 'react-router-dom';
import HomePage from '../../features/home/HomePage';
import ActivityForm from '../../features/activities/form/ActivityForm';
import ActivityDetails from '../../features/activities/details/ActivityDetails';
import TestErrors from '../../features/errors/TestError';
import NotFound from '../../features/errors/NotFound';
import { ToastContainer } from 'react-toastify';
import ServerError from '../../features/errors/ServerError'
import LoginForm from '../../features/users/LoginForm';
import { useStore } from '../stores/store';
import LoadingComponents from './LoadingComponents';
import ModalContainer from '../common/modals/ModalContainer'
import ProfilePage from '../../features/profiles/ProfilePage';


function App() {
  const location = useLocation();
  const {commonStore, userStore} = useStore();

  useEffect(() => {
    if(commonStore.token) {
      userStore.getUser().finally(() => commonStore.setAppLoaded());
    } else {
      commonStore.setAppLoaded();
    }
  }, [commonStore,userStore])

  if (!commonStore.appLoaded) return <LoadingComponents content='Loading App...'/>

  return (
    <Fragment>
      <ToastContainer position='bottom-right' hideProgressBar />
      <ModalContainer />
      <Route exact path='/' component={HomePage} />
      <Route
        path={'/(.+)'}
        render={() => (
          <>
            <NavBar />
            <Container style={{ marginTop: '7em' }}>
              <Switch>
                <Route exact path='/activities' component={ActivityDashboard} />
                <Route path='/activities/:id' component={ActivityDetails} />
                <Route path={['/createActivity', '/manage/:id']} key={location.key} component={ActivityForm} />
                <Route path='/profiles/:username' component={ProfilePage} />
                <Route path='/errors' component={TestErrors} />
                <Route path='/server-error' component={ServerError} />
                <Route path='/login' component={LoginForm} />
                <Route component={NotFound} />
              </Switch>
            </Container>
          </>
        )}
      />
    </Fragment>
  );
}

export default observer(App);
