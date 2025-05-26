// src/components/WorkspaceSelector.js
import React from 'react';
import { Select } from '@chakra-ui/react';

const WorkspaceSelector = ({ workspaces, selected, onSelect }) => {
  return (
    <Select
      value={selected?._id || ''}
      onChange={(e) => {
        const selectedId = e.target.value;
        const selectedWorkspace = workspaces.find(w => w._id === selectedId);
        onSelect(selectedWorkspace);
      }}
    >
      {workspaces.map(ws => (
        <option key={ws._id} value={ws._id}>
          {ws.name}
        </option>
      ))}
    </Select>
  );
};

export default WorkspaceSelector;
