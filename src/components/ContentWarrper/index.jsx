import React, { useState, useEffect } from 'react';
import styles from './index.less'

export default (props) => {

  return (
      <div
        className={styles.main}
      >
        {props.children}
      </div>
  );
};
