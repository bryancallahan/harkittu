import deepmerge from 'deepmerge';

export const generateTestTasks = () => deepmerge({}, {
  '18e6972d-fa66-4420-a6e7-d0b0430fb0e1': {
    uuid: '18e6972d-fa66-4420-a6e7-d0b0430fb0e1',
    rank: 1,
    detail: 'Documented flow describing the DHD test procedures in staging with screen shots to help unblock Teal\'c -- https://localhost:3000/dhd',
    created_on: '2018-09-02T23:11:21-07:00',
    completed_on: '2018-09-03T23:11:41-07:00',
    is_backlog: false,
  },
  '70bda6b5-8b63-4f2c-9d20-816969bd6f25': {
    uuid: '70bda6b5-8b63-4f2c-9d20-816969bd6f25',
    rank: 2,
    detail: 'Sample Item 1',
    created_on: '2018-09-01T23:10:11-07:00',
    completed_on: null,
    is_backlog: false,
  },
  '15713406-2852-4e6f-9be6-9a754c623ab1': {
    uuid: '15713406-2852-4e6f-9be6-9a754c623ab1',
    rank: 3,
    detail: 'Sample Item 2',
    created_on: '2018-06-02T23:10:11-07:00',
    completed_on: null,
    is_backlog: false,
  },
  '310c8ce8-aaf2-4823-870a-6c909e552700': {
    uuid: '310c8ce8-aaf2-4823-870a-6c909e552700',
    rank: 4,
    detail: 'Sample Item 3',
    created_on: '2018-06-02T23:10:11-07:00',
    completed_on: null,
    is_backlog: true,
  },
  '736d16f2-8850-43d6-8c2d-0111f041cb8a': {
    uuid: '736d16f2-8850-43d6-8c2d-0111f041cb8a',
    rank: 5,
    detail: 'Sample Item 4',
    created_on: '2018-06-02T23:10:11-07:00',
    completed_on: null,
    is_backlog: false,
  },
  '9c1f6213-6fee-498e-82d8-6b70286d3f0f': {
    uuid: '9c1f6213-6fee-498e-82d8-6b70286d3f0f',
    rank: 6,
    detail: 'Sample Item 5',
    created_on: '2018-06-03T23:10:11-07:00',
    completed_on: '2018-06-02T23:09:11-07:00',
    is_backlog: false,
  },
  '335b02f6-022b-4a1f-84fe-5bcf257b5ea2': {
    uuid: '335b02f6-022b-4a1f-84fe-5bcf257b5ea2',
    rank: 7,
    detail: 'Sample Item 6',
    created_on: '2018-06-03T23:10:11-07:00',
    completed_on: '2018-06-02T23:14:11-07:00',
    is_backlog: false,
  },
});

export default {
  generateTestTasks
};