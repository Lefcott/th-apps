/** @format */
import React from 'react';
import { List } from '@material-ui/core';
import EditableGroupListItem from './EditableGroupListItem';

export default function EditableGroupList({
  open,
  groups,
  filteredGroups,
  searchField,
  newGroups,
  onClose,
  refetchGroups,
  removeNewGroupByIndex,
  setIsEditting,
  isEditting,
  setResidentGroupDeleted,
}) {
  const [dirtyStates, setDirtyStates] = React.useState({});
  const [names, setNames] = React.useState({});

  function setFormState(guid, value) {
    if (dirtyStates[guid] !== value) {
      const nextState = { ...dirtyStates };
      nextState[guid] = value;
      setDirtyStates(nextState);
    }
  }

  function setFormName(guid, value) {
    if (guid) {
      const nextNames = { ...names };
      nextNames[guid] = { id: '', name: value };
      setNames(nextNames);
    }
  }

  React.useEffect(() => {
    if (!names.length) {
      const nextNames = allGroups.reduce((total, curr) => {
        total[curr._id || curr.clientGuid] = curr.name;
        return total;
      }, {});
      setNames(nextNames);
    }
  }, [allGroups]);

  const allGroups = !searchField.length
    ? [...newGroups, ...groups]
    : [...newGroups, ...filteredGroups];

  return (
    <List>
      {allGroups.map((group, index) => (
        <EditableGroupListItem
          open={open}
          key={group._id}
          index={index}
          names={names}
          onClose={onClose}
          refetchGroups={refetchGroups}
          setFormState={setFormState}
          setFormName={setFormName}
          group={group}
          groups={groups}
          removeNewGroupByIndex={removeNewGroupByIndex}
          setIsEditting={setIsEditting}
          isEditting={isEditting}
          setResidentGroupDeleted={setResidentGroupDeleted}
        />
      ))}
    </List>
  );
}
