import React from 'react';
import styled from '@emotion/styled';
import { isEmpty, isEqual } from 'lodash';
import { TextField, MenuItem } from '@material-ui/core';
import { orientations, designSizes } from '../../utils/componentData';

const ItemWrapper = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: ${(props) =>
    props.isSize ? 'space-between' : 'flex-start'};
`;

function DesignForm(props) {
  const { values, handleChange, setFieldValue, errors, touched } = props;
  const hasError = (field) => errors[field] && touched[field];

  const orientationChange = ({ target }) => {
    setFieldValue('orientation', target.value);

    const isPortrait = isEqual(target.value, 'portrait');
    const isCalSize = isEqual(values['size'], 'calendar');
    const isPosterSize = isEqual(values['size'], 'poster');
    if (isPortrait && (isCalSize || isPosterSize)) setFieldValue('size', '');
  };

  return (
    <>
      <FormField
        name="name"
        label="Name"
        value={values['name']}
        onChange={handleChange}
        error={hasError('name')}
        autoComplete="off"
        helperText={hasError('name') && errors['name']}
        style={{ margin: '10px 0' }}
      />

      <FormField
        select
        name="orientation"
        label="Orientation"
        value={values['orientation']}
        onChange={orientationChange}
        error={hasError('orientation')}
        helperText={hasError('orientation') && errors['orientation']}
        style={{ marginBottom: 10 }}
      >
        {orientations.map((item) => (
          <MenuItem key={item.name} value={item.value}>
            <ItemWrapper>
              {item.icon}
              <span style={{ marginLeft: 10 }}>{item.name}</span>
            </ItemWrapper>
          </MenuItem>
        ))}
      </FormField>

      {!isEmpty(values['orientation']) && (
        <FormField
          select
          name="size"
          label="Size"
          value={values['size']}
          onChange={handleChange}
          error={hasError('size')}
          helperText={hasError('size') && errors['size']}
          style={{ marginBottom: 10 }}
        >
          {designSizes.map(
            (design) =>
              isEqual(design.orientation, values['orientation']) && (
                <MenuItem key={design.size} value={design.value}>
                  <ItemWrapper isSize>
                    <span>{design.size}</span>
                    <span style={{ fontSize: 12, fontStyle: 'italic' }}>
                      {design.description}
                    </span>
                  </ItemWrapper>
                </MenuItem>
              )
          )}
        </FormField>
      )}
    </>
  );
}

const FormField = (props) => (
  <TextField {...props} required fullWidth InputLabelProps={{ shrink: true }}>
    {props.children}
  </TextField>
);

export default DesignForm;
