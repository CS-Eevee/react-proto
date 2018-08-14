import {
  ADD_COMPONENT,
  UPDATE_COMPONENT,
  DELETE_COMPONENT,
  ADD_NEW_CHILD,
  DELETE_CHILD,
  REASSIGN_PARENT,
  SET_SELECTABLE_PARENTS,
  EXPORT_FILES,
  EXPORT_FILES_SUCCESS,
  EXPORT_FILES_ERROR,
  HANDLE_CLOSE,
  HANDLE_TRANSFORM,
  CREATE_APPLICATION,
  CREATE_APPLICATION_SUCCESS,
  CREATE_APPLICATION_ERROR,
  TOGGLE_DRAGGING,
  MOVE_TO_BOTTOM,
  OPEN_EXPANSION_PANEL,
  DELETE_ALL_DATA,
} from '../actionTypes/index';

import createFiles from '../utils/createFiles.util';
import createApplicationUtil from '../utils/createApplication.util';

export const addNewChild = (({
  id, childIndex, childId,
}) => ({
  type: ADD_NEW_CHILD,
  payload: {
    id, childIndex, childId,
  },
}));

export const deleteChild = (({
  parent, childIndex, childId,
}) => ({
  type: DELETE_CHILD,
  payload: {
    parent, childIndex, childId,
  },
}));

export const parentReassignment = (({ index, id, parent }) => ({
  type: REASSIGN_PARENT,
  payload: {
    index,
    id,
    parent,
  },
}));

export const addComponent = ({ title }) => (dispatch) => {
  dispatch({ type: ADD_COMPONENT, payload: { title } });
  dispatch({ type: SET_SELECTABLE_PARENTS });
};

export const deleteComponent = ({ index, id, parent }) => (dispatch) => {
  // Delete Component  from its parent if it has a parent.
  if (parent && parent.id) {
    dispatch(deleteChild({ parent, childId: id, childIndex: index }));
  }
  // Reassign Component's children to its parent if it has one or make them orphans
  dispatch(parentReassignment({ index, id, parent }));
  dispatch({ type: DELETE_COMPONENT, payload: { index, id } });
  dispatch({ type: SET_SELECTABLE_PARENTS });
};

export const updateComponent = ({
  id, index, parent = null, newParentId = null, color = null, stateful = null,
}) => (dispatch) => {
  dispatch({
    type: UPDATE_COMPONENT,
    payload: {
      id, index, newParentId, color, stateful,
    },
  });

  if (newParentId && newParentId !== 'null') {
    dispatch(addNewChild({ id: newParentId, childId: id, childIndex: index }));
  }

  if (parent && parent.id) {
    dispatch(deleteChild({ parent, index, childId: id }));
  }

  dispatch({ type: SET_SELECTABLE_PARENTS });
};

export const exportFiles = ({ components, path }) => (dispatch) => {
  dispatch({
    type: EXPORT_FILES,
  });

  createFiles(components, path)
    .then(dir => dispatch({
      type: EXPORT_FILES_SUCCESS,
      payload: { status: true, dir: dir[0] },
    }))
    .catch(err => dispatch({
      type: EXPORT_FILES_ERROR,
      payload: { status: true, err },
    }));
};

export const handleClose = () => ({
  type: HANDLE_CLOSE,
  payload: false,
});

export const handleTransform = (id, {
  x, y, width, height,
}) => ({
  type: HANDLE_TRANSFORM,
  payload: {
    id, x, y, width, height,
  },
});

// Application generation options
// cosnt genOptions = [
//   'Export into existing project.', 'Export with create-react-app.', 'Export with starter repo'
// ];

export const createApplication = ({
  path, components = [], genOption, appName = 'proto_app', repoUrl,
}) => (dispatch) => {
  if (genOption === 0) {
    dispatch(exportFiles({ path, components }));
  } else if (genOption) {
    dispatch({
      type: CREATE_APPLICATION,
    });
    createApplicationUtil({
      path, appName, genOption, repoUrl,
    })
      .then(() => {
        dispatch({
          type: CREATE_APPLICATION_SUCCESS,
        });
        dispatch(exportFiles({ path: `${path}/${appName}/src`, components }));
      })
      .catch(err => dispatch({
        type: CREATE_APPLICATION_ERROR,
        payload: { err },
      }));
  }
};

export const toggleDragging = status => ({
  type: TOGGLE_DRAGGING,
  payload: status,
});

export const moveToBottom = componentId => ({
  type: MOVE_TO_BOTTOM,
  payload: componentId,
});

export const openExpansionPanel = component => ({
  type: OPEN_EXPANSION_PANEL,
  payload: { component },
});

export const deleteAllData = () => ({
  type: DELETE_ALL_DATA,
});
