import React, { PureComponent } from 'react';

import './AttributedString.css';

import TablePart from './components/TablePart';
import ListPart from './components/ListPart';

import classNames from 'classnames';

export default class AttributedString extends PureComponent {
  render() {
    const {
      parts,
      subPartDataAndHandlers,
    } = this.props;

    let className;

    return (
      <span>
        {parts.map(part => {
          switch (part.get('type')) {
          case 'text':
            return part.get('contents');
          case 'link':
            const uri = part.getIn(['contents', 'uri']);
            const title = part.getIn(['contents', 'title']) || uri;

            return <a key={part.get('id')} href={uri} target="_blank">{title}</a>;
          case 'percentage-cookie':
            className = classNames('attributed-string__cookie-part', {
              'attributed-string__cookie-part--complete': parseInt(part.get('percentage'), 10) === 100,
            });

            return (
              <span key={part.get('id')} className={className}>
                [{part.get('percentage')}%]
              </span>
            );
          case 'fraction-cookie':
            className = classNames('attributed-string__cookie-part', {
              'attributed-string__cookie-part--complete': (
                part.getIn(['fraction', 0]) !== '' &&
                  part.getIn(['fraction', 0]) === part.getIn(['fraction', 1])
              ),
            });

            return (
              <span key={part.get('id')} className={className}>
                [{part.getIn(['fraction', 0])}/{part.getIn(['fraction', 1])}]
              </span>
            );
          case 'table':
            return (
              <TablePart key={part.get('id')}
                         table={part}
                         subPartDataAndHandlers={subPartDataAndHandlers} />
            );
          case 'list':
            return (
              <ListPart key={part.get('id')}
                        part={part}
                        subPartDataAndHandlers={subPartDataAndHandlers} />
            );
          default:
            console.error(`Unrecognized attributed string part type ${part.get('type')}`);
            return '';
          }
        })}
      </span>
    );
  }
}
