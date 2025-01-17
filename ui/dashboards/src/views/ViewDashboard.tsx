// Copyright 2021 The Perses Authors
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import { useEffect } from 'react';
import { BoxProps } from '@mui/material';
import { DashboardResource, getDefaultTimeRange } from '@perses-dev/core';
import { useQueryString } from '@perses-dev/plugin-system';
import { TimeRangeProvider, TemplateVariableProvider, DashboardProvider } from '../context';
import { DashboardApp } from './DashboardApp';

export interface ViewDashboardProps extends BoxProps {
  dashboardResource: DashboardResource;
}

/**
 * The View for displaying a Dashboard, along with the UI for selecting variable values.
 */
export function ViewDashboard(props: ViewDashboardProps) {
  const {
    dashboardResource: { spec },
    children,
  } = props;

  const { queryString, setQueryString } = useQueryString();
  const dashboardDuration = spec.duration ?? '1h';
  const defaultTimeRange = getDefaultTimeRange(dashboardDuration, queryString);

  // TODO: add reusable sync query string or no-op util
  useEffect(() => {
    const currentParams = Object.fromEntries([...queryString]);
    // if app does not provide query string implementation, setTimeRange is used instead
    if (!currentParams.start && setQueryString) {
      // default to duration in dashboard definition if start param is not already set
      queryString.set('start', dashboardDuration);
      setQueryString(queryString);
    }
  }, [dashboardDuration, queryString, setQueryString]);

  return (
    <DashboardProvider initialState={{ dashboardSpec: spec }}>
      <TimeRangeProvider initialTimeRange={defaultTimeRange}>
        <TemplateVariableProvider initialVariableDefinitions={spec.variables}>
          <DashboardApp {...props}>{children}</DashboardApp>
        </TemplateVariableProvider>
      </TimeRangeProvider>
    </DashboardProvider>
  );
}
