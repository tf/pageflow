import React from 'react';

import {ContentElement} from './ContentElement';

export function ContentElements(props) {
  return (
    <>
    {props.items.map((item, index) => {
      console.log(`id "${item.id}"`);
      return props.children(item,
                            <ContentElement key={item.id}
                                       id={item.id}
                                       type={item.type}
                                       position={item.position}
                                       itemProps={item.props} />)

    })}
    </>
  );
}

ContentElements.defaultProps = {
  children: (item, child) => child
};
