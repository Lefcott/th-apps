/** @format */
import React from 'react';
import {
  AlexaManagementView,
  StaffManagementView,
  StaffModal,
  AlexaModal,
} from './pages';
import { useFlags } from '@teamhub/api';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
import BaseAppContainer from './components/base/BaseAppContainer';
import { DepartmentProvider } from './components/departmentContext';
import { SearchProvider } from './components/base/BaseTable/contexts/SearchContext';
import { IntegrationsProvider } from './contexts/IntegrationsProvider';

export default function App(props) {
  const flags = useFlags();

  return (
    <BaseAppContainer>
      <SearchProvider>
        <DepartmentProvider>
          <IntegrationsProvider>
            <Router basename="community-directory">
              {flags['alexa-calling'] && (
                <>
                  <Route path="/alexa" component={AlexaManagementView} />
                  <Route path="/alexa/:id" component={AlexaModal} />
                </>
              )}

              <Route path="/staff" component={StaffManagementView} />
              <Route path="/staff/:id" component={StaffModal} />

              <Redirect from="" to="/staff" />
            </Router>
          </IntegrationsProvider>
        </DepartmentProvider>
      </SearchProvider>
    </BaseAppContainer>
  );
}
