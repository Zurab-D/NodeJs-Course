'use strict';

const chai = require('chai');
const chaiFiles = require('chai-files');

chai.use(chaiFiles);
global.expect = chai.expect;
global.file = chaiFiles.file;
