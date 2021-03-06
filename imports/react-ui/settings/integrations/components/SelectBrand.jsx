import React, { PropTypes } from 'react';
import {
  FormGroup,
  ControlLabel,
  FormControl,
} from 'react-bootstrap';

const SelectBrand = ({ brands, onChange, defaultValue }) => (
  <FormGroup controlId="selectBrand">
    <ControlLabel>Brand</ControlLabel>

    <FormControl
      componentClass="select"
      placeholder="Select Brand"
      defaultValue={defaultValue}
      onChange={onChange}
    >

      <option />
      {brands.map(brand =>
        <option key={brand._id} value={brand._id}>{brand.name}</option>,
      )}
    </FormControl>
  </FormGroup>
);

SelectBrand.propTypes = {
  brands: PropTypes.array.isRequired, // eslint-disable-line react/forbid-prop-types
  onChange: PropTypes.func,
  defaultValue: PropTypes.string,
};

export default SelectBrand;
