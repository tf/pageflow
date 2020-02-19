import React from 'react';

import {ContentElement} from './ContentElement';

export function ContentElements(props) {
  return (
    <>
    {props.items.map((item, index) => {
      if (!item.id) {
        throw new Error('no key ' + JSON.stringify(item));
      }
      return props.children(item,
                       <ContentElement key={item.id}
                                       id={item.id}
                                       type={item.type}
                                       first={index === 0}
                                       position={item.position}
                                       itemProps={item.props} />);
    })}
    </>
  );
}

ContentElements.defaultProps = {
  children: (item, child) => child
};
