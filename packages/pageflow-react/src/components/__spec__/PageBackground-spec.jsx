import PageBackground from '../PageBackground';

import {shallow} from 'enzyme';

describe('PageBackground', () => {
  it('has page_background class', () => {
    const wrapper = shallow(<PageBackground />);

    expect(wrapper).toHaveClassName('page_background');
  });

  it('does not have page_background-for_page_with_player_controls by default', () => {
    const wrapper = shallow(<PageBackground />);

    expect(wrapper).not.toHaveClassName('page_background-for_page_with_player_controls');
  });

  it('has page_background-for_page_with_player_controls if pageHasPlayerControls is true', () => {
    const wrapper = shallow(<PageBackground pageHasPlayerControls={true} />);

    expect(wrapper).toHaveClassName('page_background-for_page_with_player_controls');
  });
});
