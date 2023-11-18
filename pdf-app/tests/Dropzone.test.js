import React from 'react';
import { mount } from 'enzyme';
import Dropzone from '../src/components/Dropzone';

describe('Dropzone Component', () => {
  let wrapper;
  let instance;

  beforeEach(() => {
    wrapper = mount(<Dropzone />);
    instance = wrapper.instance();
  });

  it('renders without crashing', () => {
    expect(wrapper).toBeDefined();
  });
});
