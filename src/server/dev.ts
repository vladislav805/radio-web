import { resolve } from 'path';
import express from 'express';

import { service } from '.';

service.use(express.static(resolve(__dirname)));
