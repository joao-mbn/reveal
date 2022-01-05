export const bpWells = [
    {
        "id": 6362176781872064,
        "name": "GC825 006 (well:USA00006202)",
        "externalId": "well:USA00006202",
        "description": "GC825 006",
        "country": "United States of America",
        "quadrant": null,
        "block": null,
        "field": "Mad Dog",
        "operator": "",
        "spudDate": "2018-09-20T00:00:00.000Z",
        "wellType": null,
        "license": null,
        "waterDepth": {
            "value": 1520,
            "unit": "meter"
        },
        "wellhead": {
            "x": -90.319274275463,
            "y": 27.1460577259447,
            "crs": "EPSG:4326"
        },
        "datum": {
            "elevation": {
                "value": 24.99365,
                "unit": "meter"
            },
            "reference": null,
            "name": null
        },
        "sources": [
            "BP-Pequin"
        ],
        "wellbores": [
            {
                "name": "USA0000620200",
                "id": 3449261002359307,
                "description": "GC825 006 ST00BP00",
                "externalId": "wellbore:USA0000620200",
                "wellId": 6362176781872064,
                "sourceWellbores": [
                    {
                        "id": 6880289144088442,
                        "externalId": "USA0000620200",
                        "source": "BP-Pequin"
                    }
                ],
                "metadata": {
                    "wellExternalId": "well:USA00006202",
                    "wellDescription": "GC825 006",
                    "wellName": "GC825 006 (well:USA00006202)"
                }
            }
        ],
        "geometry": {
            "type": "Point",
            "coordinates": [
                -90.319274275463,
                27.1460577259447
            ]
        },
        "metadata": {
            "x_coordinate": -90.319274275463,
            "y_coordinate": 27.1460577259447
        }
    }
]

export const bpWellBores = [
    {
        "name": "USA0000620200",
        "id": 3449261002359307,
        "description": "GC825 006 ST00BP00",
        "externalId": "wellbore:USA0000620200",
        "wellId": 6362176781872064,
        "sourceWellbores": [
            {
                "id": 6880289144088442,
                "externalId": "USA0000620200",
                "source": "BP-Pequin"
            }
        ],
        "metadata": {
            "wellExternalId": "well:USA00006202",
            "wellDescription": "GC825 006",
            "wellName": "GC825 006 (well:USA00006202)",
            "elevation_value_unit": "meter",
            "elevation_value": 24.99365,
            "elevation_type": "KB",
            "bh_x_coordinate": -90.319274275463,
            "bh_y_coordinate": 27.1460577259447
        },
        "parentId": 6362176781872064
    }
]

export const bpTrajectories = [
    {
        "id": 6011780887613643,
        "name": "Wellpath",
        "description": "Projection to TD",
        "assetId": 3449261002359307,
        "externalId": "dqnroDJPLP-lQkHf2B85T-BPi31",
        "metadata": {
            "acscan_md_min": "0.0",
            "tortuosity_type": "3.0",
            "b_interp": "",
            "final_error": "",
            "bh_tvd": "23369.3445145298",
            "source": "BP-EDM",
            "final_north": "-6308.64350812783",
            "planned_azimuth": "137.618087761756",
            "type": "Trajectory",
            "b_range": "Y",
            "acscan_md_max": "5756.93202642483",
            "vs_north": "0.0",
            "ko_tvd": "4987.009974",
            "effective_date": "2018-10-14T00:00:00",
            "tortuosity_period": "100.0",
            "interpolation_interval": "",
            "object_state": "ACTUAL",
            "create_date": "2018-10-14T08:53:31",
            "create_app_id": "COMPASS",
            "final_east": "5756.93202642483",
            "create_user_id": "BP1\\aratr0(BP1\\ARATR0)",
            "bh_md": "25861.051722",
            "interpolate": "",
            "is_definitive": "Y",
            "version": "",
            "update_date": "2019-07-02T14:01:51",
            "is_readonly": "Y",
            "definitive_path": "",
            "tortuosity": "0.203896276945846",
            "name": "Wellpath",
            "ko_north": "",
            "average_dogleg": "0.478411412599882",
            "ko_md": "4987.009974",
            "acscan_ratio_max": "6.71204286763223",
            "is_survey_program_read_only": "Y",
            "maximum_dls_value": "3.28546061521443",
            "update_user_id": "",
            "wellboreName": "GC825 006 ST00BP00",
            "b_ratio": "",
            "update_app_id": "WellPlan",
            "directional_difficulty_index": "6.07037759481257",
            "maximum_dls_depth": "8271.516543",
            "definitive_version": "",
            "use_actual_data": "N",
            "parentExternalId": "USA0000620200",
            "acscan_radius_max": "-6308.64350812783",
            "ko_east": "",
            "vs_east": "0.0",
            "remarks": "",
            "use_planned_program": "N",
            "wellName": "GC825 006 (well:USA00006202)"
        },
        "columns": [
            {
                "name": "sequence_no",
                "externalId": "sequence_no",
                "valueType": "LONG",
                "metadata": {},
                "createdTime": "2020-10-21T22:48:31.782Z",
                "lastUpdatedTime": "2020-10-21T22:48:31.782Z"
            },
            {
                "name": "azimuth",
                "externalId": "azimuth",
                "valueType": "DOUBLE",
                "metadata": {
                    "unit": "°"
                },
                "createdTime": "2020-10-21T22:48:31.782Z",
                "lastUpdatedTime": "2020-10-21T22:48:31.782Z"
            },
            {
                "name": "inclination",
                "externalId": "inclination",
                "valueType": "DOUBLE",
                "metadata": {
                    "unit": "°"
                },
                "createdTime": "2020-10-21T22:48:31.782Z",
                "lastUpdatedTime": "2020-10-21T22:48:31.782Z"
            },
            {
                "name": "md",
                "externalId": "md",
                "valueType": "DOUBLE",
                "metadata": {
                    "unit": "ft"
                },
                "createdTime": "2020-10-21T22:48:31.782Z",
                "lastUpdatedTime": "2020-10-21T22:48:31.782Z"
            },
            {
                "name": "tvd",
                "externalId": "tvd",
                "valueType": "DOUBLE",
                "metadata": {
                    "unit": "ft"
                },
                "createdTime": "2020-10-21T22:48:31.782Z",
                "lastUpdatedTime": "2020-10-21T22:48:31.782Z"
            },
            {
                "name": "x_offset",
                "externalId": "x_offset",
                "valueType": "DOUBLE",
                "metadata": {
                    "unit": "ft"
                },
                "createdTime": "2020-10-21T22:48:31.782Z",
                "lastUpdatedTime": "2020-10-21T22:48:31.782Z"
            },
            {
                "name": "y_offset",
                "externalId": "y_offset",
                "valueType": "DOUBLE",
                "metadata": {
                    "unit": "ft"
                },
                "createdTime": "2020-10-21T22:48:31.782Z",
                "lastUpdatedTime": "2020-10-21T22:48:31.782Z"
            },
            {
                "name": "definitive_survey_id",
                "externalId": "definitive_survey_id",
                "valueType": "STRING",
                "metadata": {},
                "createdTime": "2020-10-21T22:48:31.782Z",
                "lastUpdatedTime": "2020-10-21T22:48:31.782Z"
            },
            {
                "name": "covariance_yy",
                "externalId": "covariance_yy",
                "valueType": "DOUBLE",
                "metadata": {
                    "unit": "ft²"
                },
                "createdTime": "2020-10-21T22:48:31.782Z",
                "lastUpdatedTime": "2020-10-21T22:48:31.782Z"
            },
            {
                "name": "ellipse_vertical",
                "externalId": "ellipse_vertical",
                "valueType": "DOUBLE",
                "metadata": {
                    "unit": "ft"
                },
                "createdTime": "2020-10-21T22:48:31.782Z",
                "lastUpdatedTime": "2020-10-21T22:48:31.782Z"
            },
            {
                "name": "covariance_yz",
                "externalId": "covariance_yz",
                "valueType": "DOUBLE",
                "metadata": {
                    "unit": "ft²"
                },
                "createdTime": "2020-10-21T22:48:31.782Z",
                "lastUpdatedTime": "2020-10-21T22:48:31.782Z"
            },
            {
                "name": "covariance_zz",
                "externalId": "covariance_zz",
                "valueType": "DOUBLE",
                "metadata": {
                    "unit": "ft²"
                },
                "createdTime": "2020-10-21T22:48:31.782Z",
                "lastUpdatedTime": "2020-10-21T22:48:31.782Z"
            },
            {
                "name": "covariance_xx",
                "externalId": "covariance_xx",
                "valueType": "DOUBLE",
                "metadata": {
                    "unit": "ft²"
                },
                "createdTime": "2020-10-21T22:48:31.782Z",
                "lastUpdatedTime": "2020-10-21T22:48:31.782Z"
            },
            {
                "name": "data_entry_mode",
                "externalId": "data_entry_mode",
                "valueType": "LONG",
                "metadata": {},
                "createdTime": "2020-10-21T22:48:31.782Z",
                "lastUpdatedTime": "2020-10-21T22:48:31.782Z"
            },
            {
                "name": "covariance_xy",
                "externalId": "covariance_xy",
                "valueType": "DOUBLE",
                "metadata": {
                    "unit": "ft²"
                },
                "createdTime": "2020-10-21T22:48:31.782Z",
                "lastUpdatedTime": "2020-10-21T22:48:31.782Z"
            },
            {
                "name": "dogleg_severity",
                "externalId": "dogleg_severity",
                "valueType": "DOUBLE",
                "metadata": {
                    "unit": "°/100ft"
                },
                "createdTime": "2020-10-21T22:48:31.782Z",
                "lastUpdatedTime": "2020-10-21T22:48:31.782Z"
            },
            {
                "name": "dogleg_severity_max",
                "externalId": "dogleg_severity_max",
                "valueType": "DOUBLE",
                "metadata": {
                    "unit": "°/100ft"
                },
                "createdTime": "2020-10-21T22:48:31.782Z",
                "lastUpdatedTime": "2020-10-21T22:48:31.782Z"
            },
            {
                "name": "covariance_xz",
                "externalId": "covariance_xz",
                "valueType": "DOUBLE",
                "metadata": {
                    "unit": "ft²"
                },
                "createdTime": "2020-10-21T22:48:31.782Z",
                "lastUpdatedTime": "2020-10-21T22:48:31.782Z"
            },
            {
                "name": "ellipse_east",
                "externalId": "ellipse_east",
                "valueType": "DOUBLE",
                "metadata": {
                    "unit": "ft"
                },
                "createdTime": "2020-10-21T22:48:31.782Z",
                "lastUpdatedTime": "2020-10-21T22:48:31.782Z"
            },
            {
                "name": "ellipse_north",
                "externalId": "ellipse_north",
                "valueType": "DOUBLE",
                "metadata": {
                    "unit": "ft"
                },
                "createdTime": "2020-10-21T22:48:31.782Z",
                "lastUpdatedTime": "2020-10-21T22:48:31.782Z"
            },
            {
                "name": "casing_radius",
                "externalId": "casing_radius",
                "valueType": "DOUBLE",
                "metadata": {
                    "unit": "in"
                },
                "createdTime": "2020-10-21T22:48:31.782Z",
                "lastUpdatedTime": "2020-10-21T22:48:31.782Z"
            },
            {
                "name": "global_lateral_error",
                "externalId": "global_lateral_error",
                "valueType": "DOUBLE",
                "metadata": {
                    "unit": "ft"
                },
                "createdTime": "2020-10-21T22:48:31.782Z",
                "lastUpdatedTime": "2020-10-21T22:48:31.782Z"
            },
            {
                "name": "vertical_sect",
                "externalId": "vertical_sect",
                "valueType": "DOUBLE",
                "metadata": {
                    "unit": "ft"
                },
                "createdTime": "2020-10-21T22:48:31.782Z",
                "lastUpdatedTime": "2020-10-21T22:48:31.782Z"
            },
            {
                "name": "equivalent_departure",
                "externalId": "equivalent_departure",
                "valueType": "DOUBLE",
                "metadata": {
                    "unit": "ft"
                },
                "createdTime": "2020-10-21T22:48:31.782Z",
                "lastUpdatedTime": "2020-10-21T22:48:31.782Z"
            }
        ],
        "createdTime": "2020-10-21T22:48:31.782Z",
        "lastUpdatedTime": "2020-10-21T22:48:31.782Z",
        "dataSetId": 5699559864799135
    }
]

export const bpTrajectoryData = [
    {
        "id": 6011780887613643,
        "wellboreId": 3449261002359307,
        "externalId": "dqnroDJPLP-lQkHf2B85T-BPi31",
        "columns": [
            {
                "externalId": "md",
                "valueType": "DOUBLE",
                "name": "md"
            },
            {
                "externalId": "azimuth",
                "valueType": "DOUBLE",
                "name": "azimuth"
            },
            {
                "externalId": "inclination",
                "valueType": "DOUBLE",
                "name": "inclination"
            },
            {
                "externalId": "tvd",
                "valueType": "DOUBLE",
                "name": "tvd"
            },
            {
                "externalId": "x_offset",
                "valueType": "DOUBLE",
                "name": "x_offset"
            },
            {
                "externalId": "y_offset",
                "valueType": "DOUBLE",
                "name": "y_offset"
            },
            {
                "externalId": "equivalent_departure",
                "valueType": "DOUBLE",
                "name": "equivalent_departure"
            }
        ],
        "rows": [
            {
                "values": [
                    4987.009974,
                    1.22395131253033,
                    0,
                    4987.009974,
                    0,
                    0,
                    0
                ],
                "rowNumber": 0
            },
            {
                "values": [
                    5252.24050446,
                    64.7739513125303,
                    1.59,
                    5252.20646328637,
                    3.32899198787991,
                    1.56835372555251,
                    3.679698762707767
                ],
                "rowNumber": 1
            },
            {
                "values": [
                    5358.40071678,
                    64.7739513125303,
                    1.39,
                    5358.33072667615,
                    5.82616626628,
                    2.74482173663261,
                    6.440122803199742
                ],
                "rowNumber": 2
            },
            {
                "values": [
                    5492.92098582,
                    56.6339513125303,
                    1.12,
                    5492.81870957398,
                    8.40015126973513,
                    4.16325237456891,
                    9.379050932849054
                ],
                "rowNumber": 3
            },
            {
                "values": [
                    5627.9112558,
                    33.4339513125303,
                    0.78,
                    5627.79071041095,
                    10.0082460177557,
                    5.65562904761957,
                    11.572927429511243
                ],
                "rowNumber": 4
            },
            {
                "values": [
                    5762.8615257,
                    359.46395131253,
                    0.13,
                    5762.73612003435,
                    10.5129173929756,
                    6.57527800237121,
                    12.621937371579715
                ],
                "rowNumber": 5
            },
            {
                "values": [
                    5897.17179432,
                    186.91395131253,
                    0.07,
                    5897.04630153084,
                    10.5016153422976,
                    6.64619261710287,
                    12.693746900893869
                ],
                "rowNumber": 6
            },
            {
                "values": [
                    6031.94206386,
                    58.7839513125303,
                    0.13,
                    6031.81646035519,
                    10.6224611715151,
                    6.64370359234546,
                    12.814618258867078
                ],
                "rowNumber": 7
            },
            {
                "values": [
                    6167.05233408,
                    151.74395131253,
                    0.08,
                    6166.92657443287,
                    10.7982017444526,
                    6.64005718235143,
                    12.990396548331676
                ],
                "rowNumber": 8
            },
            {
                "values": [
                    6302.25260448,
                    76.2439513125303,
                    0.05,
                    6302.12677686824,
                    10.90018619322,
                    6.57094442835396,
                    13.113593119879168
                ],
                "rowNumber": 9
            },
            {
                "values": [
                    6436.08287214,
                    119.57395131253,
                    0.04,
                    6435.95700678594,
                    10.9975351687138,
                    6.56177364818047,
                    13.211373105872644
                ],
                "rowNumber": 10
            },
            {
                "values": [
                    6570.89314176,
                    251.96395131253,
                    0.07,
                    6570.76724483807,
                    10.9601577956118,
                    6.5130513974722,
                    13.272780953635637
                ],
                "rowNumber": 11
            },
            {
                "values": [
                    6705.17341032,
                    299.03395131253,
                    0.07,
                    6705.04742383572,
                    10.8104423475647,
                    6.52746458981435,
                    13.423188572817892
                ],
                "rowNumber": 12
            },
            {
                "values": [
                    6840.18368034,
                    305.52395131253,
                    0.09,
                    6840.05756184229,
                    10.6520330517639,
                    6.62910300993735,
                    13.61140088000474
                ],
                "rowNumber": 13
            },
            {
                "values": [
                    6975.24395046,
                    287.53395131253,
                    0.06,
                    6975.11771651869,
                    10.4982688993967,
                    6.71204286763223,
                    13.786107583753598
                ],
                "rowNumber": 14
            },
            {
                "values": [
                    7109.89421976,
                    235.57395131253,
                    0.09,
                    7109.76788308837,
                    10.3438099250273,
                    6.67349607165644,
                    13.945303763833643
                ],
                "rowNumber": 15
            },
            {
                "values": [
                    7244.20448838,
                    145.70395131253,
                    0.09,
                    7244.07804111725,
                    10.3162369337286,
                    6.52671304938626,
                    14.094654047301745
                ],
                "rowNumber": 16
            },
            {
                "values": [
                    7379.79475956,
                    162.98395131253,
                    0.09,
                    7379.66814753621,
                    10.4074059181397,
                    6.33690542121382,
                    14.305221655886333
                ],
                "rowNumber": 17
            },
            {
                "values": [
                    7514.22502842,
                    176.94395131253,
                    0.03,
                    7514.09833708837,
                    10.4401794481317,
                    6.20080250395065,
                    14.445214886490648
                ],
                "rowNumber": 18
            },
            {
                "values": [
                    7576.90515378,
                    154.54395131253,
                    0.12,
                    7576.7784031684,
                    10.469266913961,
                    6.12515027001812,
                    14.526266341040397
                ],
                "rowNumber": 19
            },
            {
                "values": [
                    7731.29546256,
                    205.57395131253,
                    0.37,
                    7731.1673071355,
                    10.3235675509431,
                    5.52950578600904,
                    15.139470086536958
                ],
                "rowNumber": 20
            },
            {
                "values": [
                    7866.9157338,
                    163.63395131253,
                    0.81,
                    7866.78058335006,
                    10.404650061516,
                    4.21473021805089,
                    16.456731862549635
                ],
                "rowNumber": 21
            },
            {
                "values": [
                    8000.72600142,
                    136.49395131253,
                    2.02,
                    8000.54878431105,
                    12.2947674270269,
                    1.59663923170493,
                    19.685660217508747
                ],
                "rowNumber": 22
            },
            {
                "values": [
                    8136.30627258,
                    132.81395131253,
                    2.92,
                    8136.00178206289,
                    16.4730990587412,
                    -2.48350385862416,
                    25.525572736060635
                ],
                "rowNumber": 23
            },
            {
                "values": [
                    8271.516543,
                    151.84395131253,
                    7.1,
                    8270.67334511952,
                    22.9457007314404,
                    -12.1962020827552,
                    37.19153230364696
                ],
                "rowNumber": 24
            },
            {
                "values": [
                    8405.84681166,
                    156.04395131253,
                    9.49,
                    8403.58987803042,
                    31.3607558090201,
                    -29.6381704072429,
                    56.55437848049796
                ],
                "rowNumber": 25
            },
            {
                "values": [
                    8541.78708354,
                    155.74395131253,
                    11.52,
                    8537.24467422951,
                    41.4886328257022,
                    -52.2577335336508,
                    81.33521656080107
                ],
                "rowNumber": 26
            },
            {
                "values": [
                    8676.0673521,
                    155.93395131253,
                    14.49,
                    8668.06606999763,
                    53.8503761822003,
                    -79.827686144137,
                    111.54293239398349
                ],
                "rowNumber": 27
            },
            {
                "values": [
                    8809.15761828,
                    152.66395131253,
                    16.36,
                    8796.35911065934,
                    69.2492146408807,
                    -111.684857212286,
                    146.9227770625151
                ],
                "rowNumber": 28
            },
            {
                "values": [
                    8944.15788828,
                    148.93395131253,
                    17.65,
                    8925.45823254486,
                    88.5425478673851,
                    -146.107778362471,
                    186.38091615095348
                ],
                "rowNumber": 29
            },
            {
                "values": [
                    9078.65815728,
                    143.76395131253,
                    18.37,
                    9053.37578103372,
                    111.594360934559,
                    -180.671152910757,
                    227.92298935721232
                ],
                "rowNumber": 30
            },
            {
                "values": [
                    9214.83842964,
                    139.21395131253,
                    19.83,
                    9182.06292790032,
                    139.37059378614,
                    -215.47231317548,
                    272.4449234495405
                ],
                "rowNumber": 31
            },
            {
                "values": [
                    9348.33869664,
                    134.29395131253,
                    21.52,
                    9306.97055454313,
                    171.693113090536,
                    -249.721497385026,
                    319.53092240598266
                ],
                "rowNumber": 32
            },
            {
                "values": [
                    9482.8189656,
                    130.80395131253,
                    23.6,
                    9431.15898239732,
                    209.730436689971,
                    -284.542927464973,
                    371.0919967846195
                ],
                "rowNumber": 33
            },
            {
                "values": [
                    9617.20923438,
                    127.83395131253,
                    25.79,
                    9553.25587136049,
                    253.189962608844,
                    -320.059973151289,
                    427.2095357084417
                ],
                "rowNumber": 34
            },
            {
                "values": [
                    9752.19950436,
                    131.22395131253,
                    29.1,
                    9673.04422329076,
                    301.087955555032,
                    -359.717427676825,
                    489.3730557753804
                ],
                "rowNumber": 35
            },
            {
                "values": [
                    9886.6197732,
                    133.22395131253,
                    32.33,
                    9788.59557826902,
                    351.879175969415,
                    -405.887579189384,
                    557.992926919208
                ],
                "rowNumber": 36
            },
            {
                "values": [
                    10022.09004414,
                    135.72395131253,
                    35.49,
                    9901.01567151169,
                    405.744541943752,
                    -458.867609694126,
                    633.5237488191783
                ],
                "rowNumber": 37
            },
            {
                "values": [
                    10157.2203144,
                    136.86395131253,
                    36.47,
                    10010.3659874191,
                    460.58986679844,
                    -516.261299590003,
                    712.906332090844
                ],
                "rowNumber": 38
            },
            {
                "values": [
                    10291.6705833,
                    137.64395131253,
                    36.39,
                    10118.5429649484,
                    514.782032298121,
                    -574.893408120175,
                    792.746443856684
                ],
                "rowNumber": 39
            },
            {
                "values": [
                    10410.0708201,
                    137.99395131253,
                    36.4,
                    10213.8488164331,
                    561.954759685502,
                    -626.952308943767,
                    862.9987358668653
                ],
                "rowNumber": 40
            },
            {
                "values": [
                    10561.28112252,
                    137.13395131253,
                    36.61,
                    10335.3931454593,
                    622.652591934797,
                    -693.338506971246,
                    952.9499920680818
                ],
                "rowNumber": 41
            },
            {
                "values": [
                    10695.28139052,
                    136.91395131253,
                    36.5,
                    10443.0336483168,
                    677.058094157918,
                    -751.73047521497,
                    1032.759585241417
                ],
                "rowNumber": 42
            },
            {
                "values": [
                    10830.10166016,
                    137.03395131253,
                    36.5,
                    10551.4098610339,
                    731.777021482086,
                    -810.355881521209,
                    1112.95370976788
                ],
                "rowNumber": 43
            },
            {
                "values": [
                    10965.521931,
                    137.32395131253,
                    36.51,
                    10660.2614270959,
                    786.534754671674,
                    -869.445331293336,
                    1193.5140137573003
                ],
                "rowNumber": 44
            },
            {
                "values": [
                    11100.1222002,
                    137.58395131253,
                    36.56,
                    10768.4119111975,
                    840.71666032971,
                    -928.479340040839,
                    1273.643187377767
                ],
                "rowNumber": 45
            },
            {
                "values": [
                    11234.98246992,
                    137.74395131253,
                    36.44,
                    10876.8202693487,
                    894.74173819128,
                    -987.776897866213,
                    1353.861026655929
                ],
                "rowNumber": 46
            },
            {
                "values": [
                    11370.2227404,
                    138.16395131253,
                    36.43,
                    10985.6254511624,
                    948.534422135861,
                    -1047.42320025904,
                    1434.1810977646655
                ],
                "rowNumber": 47
            },
            {
                "values": [
                    11505.2730105,
                    138.57395131253,
                    36.47,
                    11094.2567593846,
                    1001.83748833313,
                    -1107.39460385965,
                    1514.4167893202991
                ],
                "rowNumber": 48
            },
            {
                "values": [
                    11640.53328102,
                    137.98395131253,
                    36.61,
                    11202.9307738794,
                    1055.43171236428,
                    -1167.50194197704,
                    1594.9474410248695
                ],
                "rowNumber": 49
            },
            {
                "values": [
                    11774.99354994,
                    137.84395131253,
                    36.53,
                    11310.9197991473,
                    1109.12636787424,
                    -1226.95622844115,
                    1675.0593868063324
                ],
                "rowNumber": 50
            },
            {
                "values": [
                    11911.20382236,
                    138.23395131253,
                    36.5,
                    11420.392294529,
                    1163.31803265287,
                    -1287.22436885639,
                    1756.1085510228709
                ],
                "rowNumber": 51
            },
            {
                "values": [
                    12044.21408838,
                    137.60395131253,
                    36.59,
                    11527.2517084105,
                    1216.39710280988,
                    -1346.00652605694,
                    1835.3088180569764
                ],
                "rowNumber": 52
            },
            {
                "values": [
                    12180.09436014,
                    137.04395131253,
                    36.52,
                    11636.4026620913,
                    1271.25461256125,
                    -1405.50540632154,
                    1916.2373328688136
                ],
                "rowNumber": 53
            },
            {
                "values": [
                    12313.45462686,
                    137.30395131253,
                    36.5,
                    11743.5914454103,
                    1325.19088562875,
                    -1463.69812866738,
                    1995.581562087807
                ],
                "rowNumber": 54
            },
            {
                "values": [
                    12447.89489574,
                    137.76395131253,
                    36.51,
                    11851.6554042295,
                    1379.18763536141,
                    -1522.6954448404,
                    2075.558483427272
                ],
                "rowNumber": 55
            },
            {
                "values": [
                    12582.53516502,
                    138.06395131253,
                    36.49,
                    11959.8869953433,
                    1432.86558422586,
                    -1582.13102143332,
                    2155.6453079355665
                ],
                "rowNumber": 56
            },
            {
                "values": [
                    12717.8254356,
                    137.55395131253,
                    36.55,
                    12068.6131595301,
                    1486.93740363045,
                    -1641.78227799918,
                    2236.1561926983422
                ],
                "rowNumber": 57
            },
            {
                "values": [
                    12850.2757005,
                    136.81395131253,
                    36.63,
                    12174.9608446806,
                    1540.59608748706,
                    -1699.695132228,
                    2315.1061099908734
                ],
                "rowNumber": 58
            },
            {
                "values": [
                    12984.59596914,
                    137.25395131253,
                    36.44,
                    12282.8864263735,
                    1595.09602507015,
                    -1758.20762859115,
                    2395.068109941794
                ],
                "rowNumber": 59
            },
            {
                "values": [
                    13119.71623938,
                    137.50395131253,
                    36.45,
                    12391.58094545,
                    1649.44930581302,
                    -1817.27284302803,
                    2475.3362321111736
                ],
                "rowNumber": 60
            },
            {
                "values": [
                    13253.89650774,
                    137.99395131253,
                    36.47,
                    12499.4986004942,
                    1703.06324354725,
                    -1876.29513451659,
                    2555.0736619217378
                ],
                "rowNumber": 61
            },
            {
                "values": [
                    13389.64677924,
                    138.41395131253,
                    36.44,
                    12608.6859441059,
                    1756.82248963783,
                    -1936.42976773102,
                    2635.7347416472917
                ],
                "rowNumber": 62
            },
            {
                "values": [
                    13523.50704696,
                    137.49395131253,
                    36.56,
                    12716.2912370069,
                    1810.14765574547,
                    -1995.55637857736,
                    2715.3552693537276
                ],
                "rowNumber": 63
            },
            {
                "values": [
                    13657.81731558,
                    136.57395131253,
                    36.61,
                    12824.139648436,
                    1864.70646373789,
                    -2054.13253459373,
                    2795.4035732511406
                ],
                "rowNumber": 64
            },
            {
                "values": [
                    13792.95758586,
                    136.58395131253,
                    36.54,
                    12932.6677590739,
                    1920.05680629335,
                    -2112.62081669896,
                    2875.930202013146
                ],
                "rowNumber": 65
            },
            {
                "values": [
                    13927.55785506,
                    136.63395131253,
                    36.46,
                    13040.8671025515,
                    1975.05823137127,
                    -2170.80134977443,
                    2955.993482103776
                ],
                "rowNumber": 66
            },
            {
                "values": [
                    14061.80812356,
                    136.71395131253,
                    36.46,
                    13148.8408312062,
                    2029.79903484669,
                    -2228.83799262663,
                    3035.7732210626828
                ],
                "rowNumber": 67
            },
            {
                "values": [
                    14197.63839522,
                    136.81395131253,
                    36.38,
                    13258.1416324089,
                    2085.0395641014,
                    -2287.58896568317,
                    3116.415577368906
                ],
                "rowNumber": 68
            },
            {
                "values": [
                    14331.64866324,
                    137.51395131253,
                    36.46,
                    13365.978364187,
                    2139.13278986058,
                    -2345.93133868348,
                    3195.975944382464
                ],
                "rowNumber": 69
            },
            {
                "values": [
                    14467.48893492,
                    137.52395131253,
                    36.46,
                    13475.23088167,
                    2193.64987447867,
                    -2405.46581862509,
                    3276.7005800613656
                ],
                "rowNumber": 70
            },
            {
                "values": [
                    14601.81920358,
                    138.13395131253,
                    36.5,
                    13583.2414328841,
                    2247.26621117052,
                    -2464.65677539653,
                    3356.564450575961
                ],
                "rowNumber": 71
            },
            {
                "values": [
                    14736.19947234,
                    138.64395131253,
                    36.52,
                    13691.2502332572,
                    2300.35903723171,
                    -2524.43356944374,
                    3436.514955745787
                ],
                "rowNumber": 72
            },
            {
                "values": [
                    14871.05974206,
                    139.17395131253,
                    36.59,
                    13799.5817999263,
                    2353.15060254867,
                    -2584.9692314752,
                    3516.8360706775698
                ],
                "rowNumber": 73
            },
            {
                "values": [
                    15006.76001346,
                    138.59395131253,
                    36.57,
                    13908.5529146645,
                    2406.32891114121,
                    -2645.89435988723,
                    3597.704877869401
                ],
                "rowNumber": 74
            },
            {
                "values": [
                    15140.79028152,
                    138.20395131253,
                    36.61,
                    14016.1688471864,
                    2459.37318622502,
                    -2705.63716974927,
                    3677.5978088313927
                ],
                "rowNumber": 75
            },
            {
                "values": [
                    15275.76055146,
                    138.05395131253,
                    36.46,
                    14124.6165530647,
                    2513.00288607347,
                    -2765.46951935534,
                    3757.94732517558
                ],
                "rowNumber": 76
            },
            {
                "values": [
                    15410.52082098,
                    138.82395131253,
                    36.4,
                    14233.042941962,
                    2566.09296348895,
                    -2825.34767953544,
                    3837.9715792383845
                ],
                "rowNumber": 77
            },
            {
                "values": [
                    15545.09109012,
                    139.39395131253,
                    36.49,
                    14341.2952682609,
                    2618.42372094595,
                    -2885.77967918044,
                    3917.912150476344
                ],
                "rowNumber": 78
            },
            {
                "values": [
                    15681.17136228,
                    139.18395131253,
                    36.53,
                    14450.6702407548,
                    2671.2312124451,
                    -2947.15000274545,
                    3998.8747470588182
                ],
                "rowNumber": 79
            },
            {
                "values": [
                    15815.6816313,
                    139.00395131253,
                    36.65,
                    14558.6714427502,
                    2723.73448935466,
                    -3007.74824407306,
                    4079.054123963929
                ],
                "rowNumber": 80
            },
            {
                "values": [
                    15951.0819021,
                    138.78395131253,
                    36.59,
                    14667.3450024746,
                    2776.83494767886,
                    -3068.60563791509,
                    4159.820912706008
                ],
                "rowNumber": 81
            },
            {
                "values": [
                    16085.59217112,
                    137.42395131253,
                    36.66,
                    14775.2989907874,
                    2830.41907251164,
                    -3128.33323512298,
                    4240.060725307486
                ],
                "rowNumber": 82
            },
            {
                "values": [
                    16220.37244068,
                    136.98395131253,
                    36.39,
                    14883.6081322451,
                    2884.91711625063,
                    -3187.1953530582,
                    4320.277553215079
                ],
                "rowNumber": 83
            },
            {
                "values": [
                    16355.24271042,
                    137.70395131253,
                    36.44,
                    14992.1439189566,
                    2939.16641077984,
                    -3246.07575046685,
                    4400.338947739714
                ],
                "rowNumber": 84
            },
            {
                "values": [
                    16489.65297924,
                    137.77395131253,
                    36.49,
                    15100.2393556955,
                    2992.88931598684,
                    -3305.19718851035,
                    4480.223199063012
                ],
                "rowNumber": 85
            },
            {
                "values": [
                    16623.49324692,
                    137.86395131253,
                    36.42,
                    15207.8902675499,
                    3046.28958195913,
                    -3364.12855957111,
                    4559.749876407161
                ],
                "rowNumber": 86
            },
            {
                "values": [
                    16758.54351702,
                    138.21395131253,
                    36.32,
                    15316.6334444183,
                    3099.83608691083,
                    -3423.67890946644,
                    4639.833926523396
                ],
                "rowNumber": 87
            },
            {
                "values": [
                    16892.3837847,
                    138.75395131253,
                    36.24,
                    15424.5270240553,
                    3152.3303952353,
                    -3482.9789177372,
                    4719.030573148332
                ],
                "rowNumber": 88
            },
            {
                "values": [
                    17027.72405538,
                    138.65395131253,
                    36.39,
                    15533.5805745407,
                    3205.22661188025,
                    -3543.19760392551,
                    4799.182250729592
                ],
                "rowNumber": 89
            },
            {
                "values": [
                    17162.90432574,
                    138.18395131253,
                    36.15,
                    15642.5681997239,
                    3258.300886954,
                    -3603.01784962852,
                    4879.152849495685
                ],
                "rowNumber": 90
            },
            {
                "values": [
                    17296.66459326,
                    137.89395131253,
                    36.64,
                    15750.2376886299,
                    3311.36788894977,
                    -3662.03361980648,
                    4958.518343127524
                ],
                "rowNumber": 91
            },
            {
                "values": [
                    17431.4348628,
                    136.10395131253,
                    36.59,
                    15858.4157024019,
                    3366.18351610311,
                    -3720.81510722744,
                    5038.8902388421
                ],
                "rowNumber": 92
            },
            {
                "values": [
                    17567.22513438,
                    135.89395131253,
                    36.55,
                    15967.4729229276,
                    3422.3854089514,
                    -3779.01183970298,
                    5119.794544639707
                ],
                "rowNumber": 93
            },
            {
                "values": [
                    17715.90543174,
                    136.59395131253,
                    36.66,
                    16086.8288370554,
                    3483.69846763595,
                    -3843.04777385975,
                    5208.45015741397
                ],
                "rowNumber": 94
            },
            {
                "values": [
                    17853.21570636,
                    136.22395131253,
                    36.26,
                    16197.2635477998,
                    3539.95971002152,
                    -3902.14818899581,
                    5290.04743700587
                ],
                "rowNumber": 95
            },
            {
                "values": [
                    17984.30596854,
                    135.98395131253,
                    36.02,
                    16303.129181924,
                    3593.56356964732,
                    -3957.85919972923,
                    5367.3589298471425
                ],
                "rowNumber": 96
            },
            {
                "values": [
                    18119.21623836,
                    135.60395131253,
                    35.98,
                    16412.2740189305,
                    3648.85322972781,
                    -4014.70297825325,
                    5446.656755990352
                ],
                "rowNumber": 97
            },
            {
                "values": [
                    18254.51650896,
                    135.30395131253,
                    35.99,
                    16521.7551399042,
                    3704.62013079874,
                    -4071.3605958723,
                    5526.155327596255
                ],
                "rowNumber": 98
            },
            {
                "values": [
                    18389.16677826,
                    135.43395131253,
                    35.92,
                    16630.7516324872,
                    3760.16277348308,
                    -4127.62310145246,
                    5605.215123236945
                ],
                "rowNumber": 99
            },
            {
                "values": [
                    18523.0870461,
                    135.53395131253,
                    35.92,
                    16739.2052176598,
                    3815.24539118824,
                    -4183.64418374664,
                    5683.780098614954
                ],
                "rowNumber": 100
            },
            {
                "values": [
                    18659.7873195,
                    135.78395131253,
                    36,
                    16849.8541817317,
                    3871.35032237317,
                    -4241.05494001152,
                    5764.053064760903
                ],
                "rowNumber": 101
            },
            {
                "values": [
                    18797.31759456,
                    136.10395131253,
                    35.93,
                    16961.1679648978,
                    3927.51485095208,
                    -4299.10099632996,
                    5844.823019594024
                ],
                "rowNumber": 102
            },
            {
                "values": [
                    18926.69785332,
                    136.54395131253,
                    35.87,
                    17065.9715342489,
                    3979.90556977913,
                    -4353.97035001575,
                    5920.68745718263
                ],
                "rowNumber": 103
            },
            {
                "values": [
                    19063.09812612,
                    136.98395131253,
                    35.87,
                    17176.5034844762,
                    4034.65329525351,
                    -4412.19729877441,
                    6000.610354091441
                ],
                "rowNumber": 104
            },
            {
                "values": [
                    19197.72839538,
                    137.15395131253,
                    35.91,
                    17285.5734104984,
                    4088.41003839913,
                    -4469.98369768428,
                    6079.534695619601
                ],
                "rowNumber": 105
            },
            {
                "values": [
                    19331.40866274,
                    138.56395131253,
                    35.89,
                    17393.8618720213,
                    4141.00113480382,
                    -4528.10330967906,
                    6157.91517397354
                ],
                "rowNumber": 106
            },
            {
                "values": [
                    19467.17893428,
                    137.50395131253,
                    35.87,
                    17503.8703058357,
                    4194.2092874586,
                    -4587.26768096557,
                    6237.485307485025
                ],
                "rowNumber": 107
            },
            {
                "values": [
                    19599.99919992,
                    137.48395131253,
                    35.92,
                    17611.4670447491,
                    4246.82541460657,
                    -4644.67592708679,
                    6315.358041781093
                ],
                "rowNumber": 108
            },
            {
                "values": [
                    19736.4394728,
                    137.71395131253,
                    35.66,
                    17722.1426975029,
                    4300.63098809715,
                    -4703.5976354603,
                    6395.15014513225
                ],
                "rowNumber": 109
            },
            {
                "values": [
                    19869.45973884,
                    137.57395131253,
                    34.95,
                    17830.6981520279,
                    4352.42429435366,
                    -4760.40721680459,
                    6472.0248606828245
                ],
                "rowNumber": 110
            },
            {
                "values": [
                    20004.58000908,
                    137.69395131253,
                    34.94,
                    17941.4565561454,
                    4404.57838627931,
                    -4817.5912338594,
                    6549.420336286578
                ],
                "rowNumber": 111
            },
            {
                "values": [
                    20139.08027808,
                    138.46395131253,
                    34.89,
                    18051.7475941297,
                    4456.01028434473,
                    -4874.87019003741,
                    6626.4012415168945
                ],
                "rowNumber": 112
            },
            {
                "values": [
                    20273.5905471,
                    138.61395131253,
                    34.88,
                    18162.0866082332,
                    4506.94684309291,
                    -4932.52240591143,
                    6703.3317866262705
                ],
                "rowNumber": 113
            },
            {
                "values": [
                    20410.23082038,
                    138.27395131253,
                    34.88,
                    18274.1797747539,
                    4558.78038681723,
                    -4990.99421218868,
                    6781.470488086159
                ],
                "rowNumber": 114
            },
            {
                "values": [
                    20542.57108506,
                    137.78395131253,
                    34.99,
                    18382.672817559,
                    4609.46142843932,
                    -5047.33777397566,
                    6857.253985297136
                ],
                "rowNumber": 115
            },
            {
                "values": [
                    20678.81135754,
                    137.30395131253,
                    34.94,
                    18494.3222409433,
                    4662.16413860704,
                    -5104.94164202281,
                    6935.329314831995
                ],
                "rowNumber": 116
            },
            {
                "values": [
                    20815.40163072,
                    137.29395131253,
                    34.57,
                    18606.5442311048,
                    4714.97052083243,
                    -5162.16531541505,
                    7013.194715684005
                ],
                "rowNumber": 117
            },
            {
                "values": [
                    20949.58189908,
                    137.13395131253,
                    33.48,
                    18717.7503109476,
                    4765.96847084336,
                    -5217.26717252572,
                    7088.272430431571
                ],
                "rowNumber": 118
            },
            {
                "values": [
                    21083.06216604,
                    137.14395131253,
                    32.44,
                    18829.7454707253,
                    4815.3658979935,
                    -5270.49752900302,
                    7160.889832406849
                ],
                "rowNumber": 119
            },
            {
                "values": [
                    21215.80243152,
                    136.92395131253,
                    30.91,
                    18942.7094690739,
                    4862.86870438617,
                    -5321.50285778931,
                    7230.585453051377
                ],
                "rowNumber": 120
            },
            {
                "values": [
                    21353.06270604,
                    137.39395131253,
                    29.71,
                    19061.205294289,
                    4909.97409907841,
                    -5372.29152363032,
                    7299.85335533572
                ],
                "rowNumber": 121
            },
            {
                "values": [
                    21488.92297776,
                    138.42395131253,
                    28.36,
                    19179.9891131865,
                    4954.18048319877,
                    -5421.21230094837,
                    7365.785058402155
                ],
                "rowNumber": 122
            },
            {
                "values": [
                    21620.10324012,
                    139.68395131253,
                    27.18,
                    19296.0596595903,
                    4994.24247661859,
                    -5467.36603823304,
                    7426.898080079679
                ],
                "rowNumber": 123
            },
            {
                "values": [
                    21755.63351118,
                    140.33395131253,
                    25.88,
                    19417.3163341459,
                    5033.15214371205,
                    -5513.73934711902,
                    7487.430021152407
                ],
                "rowNumber": 124
            },
            {
                "values": [
                    21891.41378274,
                    140.29395131253,
                    24.99,
                    19539.9346134283,
                    5070.39086941129,
                    -5558.61635905469,
                    7545.744102517069
                ],
                "rowNumber": 125
            },
            {
                "values": [
                    22026.33405258,
                    140.26395131253,
                    23.69,
                    19662.859961744,
                    5105.9257974967,
                    -5601.38697805266,
                    7601.3479840603195
                ],
                "rowNumber": 126
            },
            {
                "values": [
                    22160.31432054,
                    138.79395131253,
                    22.52,
                    19786.0922039607,
                    5140.03570191481,
                    -5641.39030054121,
                    7653.91710670504
                ],
                "rowNumber": 127
            },
            {
                "values": [
                    22294.5945891,
                    138.23395131253,
                    21.45,
                    19910.6061952436,
                    5173.33112868527,
                    -5679.05098183376,
                    7704.183992881855
                ],
                "rowNumber": 128
            },
            {
                "values": [
                    22431.48486288,
                    137.51395131253,
                    20.31,
                    20038.5048439193,
                    5206.05018128772,
                    -5715.24071555903,
                    7752.969935856205
                ],
                "rowNumber": 129
            },
            {
                "values": [
                    22563.92512776,
                    138.33395131253,
                    18.93,
                    20163.2528912685,
                    5235.85737646644,
                    -5748.24068387766,
                    7797.436417636927
                ],
                "rowNumber": 130
            },
            {
                "values": [
                    22699.21539834,
                    139.06395131253,
                    17.23,
                    20291.8585354322,
                    5263.57677342093,
                    -5779.77343036896,
                    7839.417554639192
                ],
                "rowNumber": 131
            },
            {
                "values": [
                    22834.98566988,
                    138.74395131253,
                    15.69,
                    20422.060747794,
                    5288.85942911604,
                    -5808.76695191165,
                    7877.883879878313
                ],
                "rowNumber": 132
            },
            {
                "values": [
                    22969.18593828,
                    137.55395131253,
                    14.4,
                    20551.6585092936,
                    5312.08849823746,
                    -5834.72342107727,
                    7912.7151814542785
                ],
                "rowNumber": 133
            },
            {
                "values": [
                    23104.67620926,
                    135.33395131253,
                    13.63,
                    20683.1155288868,
                    5334.68174291817,
                    -5858.50997091473,
                    7945.520767591513
                ],
                "rowNumber": 134
            },
            {
                "values": [
                    23238.38647668,
                    135.68395131253,
                    13.03,
                    20813.2228394726,
                    5356.28732507494,
                    -5880.49987381609,
                    7976.348341713449
                ],
                "rowNumber": 135
            },
            {
                "values": [
                    23371.48674288,
                    134.26395131253,
                    12.99,
                    20942.906860559,
                    5377.48250723036,
                    -5901.67658550164,
                    8006.309719091491
                ],
                "rowNumber": 136
            },
            {
                "values": [
                    23505.75701142,
                    134.50395131253,
                    11.71,
                    21074.0673020748,
                    5398.00812226539,
                    -5921.76119949196,
                    8035.025984236723
                ],
                "rowNumber": 137
            },
            {
                "values": [
                    23642.36728464,
                    135.34395131253,
                    12.36,
                    21207.6743252955,
                    5418.17186023991,
                    -5941.87932788142,
                    8063.509255705844
                ],
                "rowNumber": 138
            },
            {
                "values": [
                    23777.46755484,
                    134.41395131253,
                    12.65,
                    21339.5696223418,
                    5438.90142644722,
                    -5962.51766502188,
                    8092.760759264207
                ],
                "rowNumber": 139
            },
            {
                "values": [
                    23912.9478258,
                    135.79395131253,
                    13.29,
                    21471.5931169963,
                    5460.35568824462,
                    -5984.06249768118,
                    8123.165387852714
                ],
                "rowNumber": 140
            },
            {
                "values": [
                    24046.58809308,
                    139.08395131253,
                    13.65,
                    21601.5589333259,
                    5481.39399007324,
                    -6006.9900483091,
                    8154.282063312966
                ],
                "rowNumber": 141
            },
            {
                "values": [
                    24183.41836674,
                    140.66395131253,
                    14,
                    21734.4255227748,
                    5502.45975735686,
                    -6031.99206211395,
                    8186.975378597553
                ],
                "rowNumber": 142
            },
            {
                "values": [
                    24319.3986387,
                    138.60395131253,
                    13.77,
                    21866.4330915617,
                    5523.58736612047,
                    -6056.85409695311,
                    8219.601756952547
                ],
                "rowNumber": 143
            },
            {
                "values": [
                    24455.51891094,
                    138.89395131253,
                    12.93,
                    21998.8739161728,
                    5544.31264988708,
                    -6080.48215489206,
                    8251.030834220981
                ],
                "rowNumber": 144
            },
            {
                "values": [
                    24593.08918608,
                    139.22395131253,
                    12.88,
                    22132.9694153992,
                    5564.44576988398,
                    -6103.69058779704,
                    8281.754985935622
                ],
                "rowNumber": 145
            },
            {
                "values": [
                    24728.41945674,
                    138.46395131253,
                    12.78,
                    22264.9210033599,
                    5584.22190347365,
                    -6126.31683896583,
                    8311.805625487541
                ],
                "rowNumber": 146
            },
            {
                "values": [
                    24864.6497292,
                    136.52395131253,
                    12.69,
                    22397.8006232351,
                    5604.50869454295,
                    -6148.45390959531,
                    8341.832197825866
                ],
                "rowNumber": 147
            },
            {
                "values": [
                    24997.76999544,
                    135.58395131253,
                    12.76,
                    22527.6513926311,
                    5624.85785005165,
                    -6169.56488663997,
                    8371.15385188082
                ],
                "rowNumber": 148
            },
            {
                "values": [
                    25132.4002647,
                    135.99395131253,
                    12.58,
                    22659.0033233502,
                    5645.44904028332,
                    -6190.73004560716,
                    8400.682808465202
                ],
                "rowNumber": 149
            },
            {
                "values": [
                    25271.64054318,
                    136.14395131253,
                    12.51,
                    22794.9193349126,
                    5666.43206051125,
                    -6212.51083715087,
                    8430.926646536993
                ],
                "rowNumber": 150
            },
            {
                "values": [
                    25404.08080806,
                    135.49395131253,
                    12.97,
                    22924.0987501017,
                    5686.78875042788,
                    -6233.45371818501,
                    8460.132622590341
                ],
                "rowNumber": 151
            },
            {
                "values": [
                    25540.38108066,
                    135.78395131253,
                    13.01,
                    23056.9110164861,
                    5708.20979634803,
                    -6255.35810682951,
                    8490.770232997374
                ],
                "rowNumber": 152
            },
            {
                "values": [
                    25676.551353,
                    137.20395131253,
                    13.05,
                    23189.5755391594,
                    5729.34341469722,
                    -6277.62441932611,
                    8521.468987308113
                ],
                "rowNumber": 153
            },
            {
                "values": [
                    25804.86160962,
                    138.96395131253,
                    12.98,
                    23314.5901422244,
                    5748.6459712886,
                    -6299.12359568102,
                    8550.361830874068
                ],
                "rowNumber": 154
            },
            {
                "values": [
                    25861.051722,
                    138.96395131253,
                    12.98,
                    23369.3445145298,
                    5756.93202642483,
                    -6308.64350812783,
                    8562.982743785416
                ],
                "rowNumber": 155
            }
        ]
    }
]

export const bpCasings = [
  {
    id: 300496757234357,
    name: 'USA0000620200_1pmrr',
    description: 'EDM Casing',
    assetId: 3449261002359307,
    externalId: 'LiYtLiMUbH_pnxnfnBvnj_1pmrr',
    metadata: {
      assy_min_inside_diameter: '2.75',
      policy_id: 'V3Kd9rrghw',
      assy_design_native_uid: '',
      assy_date_in_hole: '1336694400000000000',
      source: 'EDM',
      assy_sequence_no: '3',
      type: 'Casing',
      assy_report_desc: '36" Conductor - TIANDI',
      assy_date_landed: '1174780800000000000',
      wellboreName: 'OCS-G 09981 /GC825-6 (SP5) ST00BP00',
      assy_current_status_date: '1544486400000000000',
      assy_comments: 'LOST 118 BBLS WHILE ATTEMPTING TO CIRCULATE AT LAND OUT.',
      assy_original_md_base: '5250.999836',
      assy_current_status_reason: 'ORIGINAL INSTALL',
      object_state: 'ACTUAL',
      assy_current_status_comment:
        "INSTALLED 08/14/2014 - LPWHH AT 5022' (10' STICKUP) - SHOE AT 5338'",
      assy_current_md_top: '19511.039022',
      assy_hole_size: '26.0',
      assy_event_native_uid: '13urd',
      assy_report_type: 'CASING',
      assy_original_md_top: '4974.499836',
      assy_design_existance_kind: '',
      assy_size: '36.0',
      assy_current_md_base: '19514.06902806',
      datasetName: 'BP-EDM-casing',
      assy_current_status_desc: 'INSTALLED',
      assy_report_date: '1544486400000000000',
      assy_type: 'Casing',
      assy_native_uid: '1pmrr',
      assy_report_native_uid: 'li1tknruvq',
      parentExternalId: 'USA0000620200',
      assy_cement_jobs_native_uid: '6HFPy',
      assy_name: '36" Conductor - TIANDI',
      assy_design_name: '34576',
    },
    columns: [
      {
        name: 'comp_body_inside_diameter',
        externalId: 'comp_body_inside_diameter',
        valueType: 'DOUBLE',
        metadata: {
          unit: 'in',
        },
        createdTime: '2020-06-19T21:19:06.981Z',
        lastUpdatedTime: '2020-06-19T21:19:06.981Z',
      },
      {
        name: 'comp_body_outside_diameter',
        externalId: 'comp_body_outside_diameter',
        valueType: 'DOUBLE',
        metadata: {
          unit: 'in',
        },
        createdTime: '2020-06-19T21:19:06.981Z',
        lastUpdatedTime: '2020-06-19T21:19:06.981Z',
      },
      {
        name: 'comp_comment',
        externalId: 'comp_comment',
        valueType: 'STRING',
        metadata: {},
        createdTime: '2020-06-19T21:19:06.981Z',
        lastUpdatedTime: '2020-06-19T21:19:06.981Z',
      },
      {
        name: 'comp_description',
        externalId: 'comp_description',
        valueType: 'STRING',
        metadata: {},
        createdTime: '2020-06-19T21:19:06.981Z',
        lastUpdatedTime: '2020-06-19T21:19:06.981Z',
      },
      {
        name: 'comp_drift_inside_diameter',
        externalId: 'comp_drift_inside_diameter',
        valueType: 'DOUBLE',
        metadata: {
          unit: 'in',
        },
        createdTime: '2020-06-19T21:19:06.981Z',
        lastUpdatedTime: '2020-06-19T21:19:06.981Z',
      },
      {
        name: 'comp_grade',
        externalId: 'comp_grade',
        valueType: 'STRING',
        metadata: {},
        createdTime: '2020-06-19T21:19:06.981Z',
        lastUpdatedTime: '2020-06-19T21:19:06.981Z',
      },
      {
        name: 'comp_has_threadlock',
        externalId: 'comp_has_threadlock',
        valueType: 'STRING',
        metadata: {},
        createdTime: '2020-06-19T21:19:06.981Z',
        lastUpdatedTime: '2020-06-19T21:19:06.981Z',
      },
      {
        name: 'comp_joints_no',
        externalId: 'comp_joints_no',
        valueType: 'DOUBLE',
        metadata: {},
        createdTime: '2020-06-19T21:19:06.981Z',
        lastUpdatedTime: '2020-06-19T21:19:06.981Z',
      },
      {
        name: 'comp_length',
        externalId: 'comp_length',
        valueType: 'DOUBLE',
        metadata: {
          unit: 'ft',
        },
        createdTime: '2020-06-19T21:19:06.981Z',
        lastUpdatedTime: '2020-06-19T21:19:06.981Z',
      },
      {
        name: 'comp_manufacturer',
        externalId: 'comp_manufacturer',
        valueType: 'STRING',
        metadata: {},
        createdTime: '2020-06-19T21:19:06.981Z',
        lastUpdatedTime: '2020-06-19T21:19:06.981Z',
      },
      {
        name: 'comp_md_base',
        externalId: 'comp_md_base',
        valueType: 'DOUBLE',
        metadata: {
          unit: 'ft',
        },
        createdTime: '2020-06-19T21:19:06.981Z',
        lastUpdatedTime: '2020-06-19T21:19:06.981Z',
      },
      {
        name: 'comp_md_top',
        externalId: 'comp_md_top',
        valueType: 'DOUBLE',
        metadata: {
          unit: 'ft',
        },
        createdTime: '2020-06-19T21:19:06.981Z',
        lastUpdatedTime: '2020-06-19T21:19:06.981Z',
      },
      {
        name: 'comp_model',
        externalId: 'comp_model',
        valueType: 'STRING',
        metadata: {},
        createdTime: '2020-06-19T21:19:06.981Z',
        lastUpdatedTime: '2020-06-19T21:19:06.981Z',
      },
      {
        name: 'comp_name',
        externalId: 'comp_name',
        valueType: 'STRING',
        metadata: {},
        createdTime: '2020-06-19T21:19:06.981Z',
        lastUpdatedTime: '2020-06-19T21:19:06.981Z',
      },
      {
        name: 'comp_section_type_code',
        externalId: 'comp_section_type_code',
        valueType: 'STRING',
        metadata: {},
        createdTime: '2020-06-19T21:19:06.981Z',
        lastUpdatedTime: '2020-06-19T21:19:06.981Z',
      },
      {
        name: 'comp_sequence_no',
        externalId: 'comp_sequence_no',
        valueType: 'DOUBLE',
        metadata: {},
        createdTime: '2020-06-19T21:19:06.981Z',
        lastUpdatedTime: '2020-06-19T21:19:06.981Z',
      },
      {
        name: 'comp_serial_no',
        externalId: 'comp_serial_no',
        valueType: 'STRING',
        metadata: {},
        createdTime: '2020-06-19T21:19:06.981Z',
        lastUpdatedTime: '2020-06-19T21:19:06.981Z',
      },
      {
        name: 'comp_thread',
        externalId: 'comp_thread',
        valueType: 'STRING',
        metadata: {},
        createdTime: '2020-06-19T21:19:06.981Z',
        lastUpdatedTime: '2020-06-19T21:19:06.981Z',
      },
      {
        name: 'comp_type_code',
        externalId: 'comp_type_code',
        valueType: 'STRING',
        metadata: {},
        createdTime: '2020-06-19T21:19:06.981Z',
        lastUpdatedTime: '2020-06-19T21:19:06.981Z',
      },
      {
        name: 'comp_weight',
        externalId: 'comp_weight',
        valueType: 'DOUBLE',
        metadata: {
          unit: 'ppf',
        },
        createdTime: '2020-06-19T21:19:06.981Z',
        lastUpdatedTime: '2020-06-19T21:19:06.981Z',
      },
    ],
    createdTime: '2020-06-19T21:19:06.981Z',
    lastUpdatedTime: '2020-07-01T07:09:30.569Z',
    dataSetId: 4464571136926873,
  },
  {
    id: 4031927249242881,
    name: 'USA0000620200_4q1d0',
    description: 'EDM Casing',
    assetId: 3449261002359307,
    externalId: 'LiYtLiMUbH_pnxnfnBvnj_4q1d0',
    metadata: {
      assy_min_inside_diameter: '12.413',
      policy_id: 'V3Kd9rrghw',
      assy_design_native_uid: '',
      assy_date_in_hole: '1540536300000000000',
      source: 'EDM',
      assy_sequence_no: '5',
      type: 'Casing',
      assy_report_desc: '22" Casing - TIANDI',
      assy_date_landed: '1174780800000000000',
      wellboreName: 'OCS-G 09981 /GC825-6 (SP5) ST00BP00',
      assy_current_status_date: '1544486400000000000',
      assy_comments: 'LOST 118 BBLS WHILE ATTEMPTING TO CIRCULATE AT LAND OUT.',
      assy_original_md_base: '7563.679836',
      assy_current_status_reason: 'ORIGINAL INSTALL',
      object_state: 'ACTUAL',
      assy_current_status_comment:
        "INSTALLED 08/14/2014 - LPWHH AT 5022' (10' STICKUP) - SHOE AT 5338'",
      assy_current_md_top: '19511.039022',
      assy_hole_size: '18.125',
      assy_event_native_uid: '13urd',
      assy_report_type: 'CASING',
      assy_original_md_top: '4970.169836',
      assy_design_existance_kind: '',
      assy_size: '22.0',
      assy_current_md_base: '19514.06902806',
      datasetName: 'BP-EDM-casing',
      assy_current_status_desc: 'INSTALLED',
      assy_report_date: '1544486400000000000',
      assy_type: 'Casing',
      assy_native_uid: '4q1d0',
      assy_report_native_uid: '10r1gef9pr',
      parentExternalId: 'USA0000620200',
      assy_cement_jobs_native_uid: '1djfb',
      assy_name: '22" Casing - TIANDI',
      assy_design_name: '34582',
    },
    columns: [
      {
        name: 'comp_body_inside_diameter',
        externalId: 'comp_body_inside_diameter',
        valueType: 'DOUBLE',
        metadata: {
          unit: 'in',
        },
        createdTime: '2020-06-20T01:20:24.542Z',
        lastUpdatedTime: '2020-06-20T01:20:24.542Z',
      },
      {
        name: 'comp_body_outside_diameter',
        externalId: 'comp_body_outside_diameter',
        valueType: 'DOUBLE',
        metadata: {
          unit: 'in',
        },
        createdTime: '2020-06-20T01:20:24.542Z',
        lastUpdatedTime: '2020-06-20T01:20:24.542Z',
      },
      {
        name: 'comp_comment',
        externalId: 'comp_comment',
        valueType: 'STRING',
        metadata: {},
        createdTime: '2020-06-20T01:20:24.542Z',
        lastUpdatedTime: '2020-06-20T01:20:24.542Z',
      },
      {
        name: 'comp_description',
        externalId: 'comp_description',
        valueType: 'STRING',
        metadata: {},
        createdTime: '2020-06-20T01:20:24.542Z',
        lastUpdatedTime: '2020-06-20T01:20:24.542Z',
      },
      {
        name: 'comp_drift_inside_diameter',
        externalId: 'comp_drift_inside_diameter',
        valueType: 'DOUBLE',
        metadata: {
          unit: 'in',
        },
        createdTime: '2020-06-20T01:20:24.542Z',
        lastUpdatedTime: '2020-06-20T01:20:24.542Z',
      },
      {
        name: 'comp_grade',
        externalId: 'comp_grade',
        valueType: 'STRING',
        metadata: {},
        createdTime: '2020-06-20T01:20:24.542Z',
        lastUpdatedTime: '2020-06-20T01:20:24.542Z',
      },
      {
        name: 'comp_has_threadlock',
        externalId: 'comp_has_threadlock',
        valueType: 'STRING',
        metadata: {},
        createdTime: '2020-06-20T01:20:24.542Z',
        lastUpdatedTime: '2020-06-20T01:20:24.542Z',
      },
      {
        name: 'comp_joints_no',
        externalId: 'comp_joints_no',
        valueType: 'DOUBLE',
        metadata: {},
        createdTime: '2020-06-20T01:20:24.542Z',
        lastUpdatedTime: '2020-06-20T01:20:24.542Z',
      },
      {
        name: 'comp_length',
        externalId: 'comp_length',
        valueType: 'DOUBLE',
        metadata: {
          unit: 'ft',
        },
        createdTime: '2020-06-20T01:20:24.542Z',
        lastUpdatedTime: '2020-06-20T01:20:24.542Z',
      },
      {
        name: 'comp_manufacturer',
        externalId: 'comp_manufacturer',
        valueType: 'STRING',
        metadata: {},
        createdTime: '2020-06-20T01:20:24.542Z',
        lastUpdatedTime: '2020-06-20T01:20:24.542Z',
      },
      {
        name: 'comp_md_base',
        externalId: 'comp_md_base',
        valueType: 'DOUBLE',
        metadata: {
          unit: 'ft',
        },
        createdTime: '2020-06-20T01:20:24.542Z',
        lastUpdatedTime: '2020-06-20T01:20:24.542Z',
      },
      {
        name: 'comp_md_top',
        externalId: 'comp_md_top',
        valueType: 'DOUBLE',
        metadata: {
          unit: 'ft',
        },
        createdTime: '2020-06-20T01:20:24.542Z',
        lastUpdatedTime: '2020-06-20T01:20:24.542Z',
      },
      {
        name: 'comp_model',
        externalId: 'comp_model',
        valueType: 'STRING',
        metadata: {},
        createdTime: '2020-06-20T01:20:24.542Z',
        lastUpdatedTime: '2020-06-20T01:20:24.542Z',
      },
      {
        name: 'comp_name',
        externalId: 'comp_name',
        valueType: 'STRING',
        metadata: {},
        createdTime: '2020-06-20T01:20:24.542Z',
        lastUpdatedTime: '2020-06-20T01:20:24.542Z',
      },
      {
        name: 'comp_section_type_code',
        externalId: 'comp_section_type_code',
        valueType: 'STRING',
        metadata: {},
        createdTime: '2020-06-20T01:20:24.542Z',
        lastUpdatedTime: '2020-06-20T01:20:24.542Z',
      },
      {
        name: 'comp_sequence_no',
        externalId: 'comp_sequence_no',
        valueType: 'DOUBLE',
        metadata: {},
        createdTime: '2020-06-20T01:20:24.542Z',
        lastUpdatedTime: '2020-06-20T01:20:24.542Z',
      },
      {
        name: 'comp_serial_no',
        externalId: 'comp_serial_no',
        valueType: 'STRING',
        metadata: {},
        createdTime: '2020-06-20T01:20:24.542Z',
        lastUpdatedTime: '2020-06-20T01:20:24.542Z',
      },
      {
        name: 'comp_thread',
        externalId: 'comp_thread',
        valueType: 'STRING',
        metadata: {},
        createdTime: '2020-06-20T01:20:24.542Z',
        lastUpdatedTime: '2020-06-20T01:20:24.542Z',
      },
      {
        name: 'comp_type_code',
        externalId: 'comp_type_code',
        valueType: 'STRING',
        metadata: {},
        createdTime: '2020-06-20T01:20:24.542Z',
        lastUpdatedTime: '2020-06-20T01:20:24.542Z',
      },
      {
        name: 'comp_weight',
        externalId: 'comp_weight',
        valueType: 'DOUBLE',
        metadata: {
          unit: 'ppf',
        },
        createdTime: '2020-06-20T01:20:24.542Z',
        lastUpdatedTime: '2020-06-20T01:20:24.542Z',
      },
    ],
    createdTime: '2020-06-20T01:20:24.542Z',
    lastUpdatedTime: '2020-07-01T08:00:13.591Z',
    dataSetId: 4464571136926873,
  },
  {
    id: 8555307572725859,
    name: 'USA0000620200_4i6rv',
    description: 'EDM Casing',
    assetId: 3449261002359307,
    externalId: 'LiYtLiMUbH_pnxnfnBvnj_4i6rv',
    metadata: {
      assy_min_inside_diameter: '12.413',
      policy_id: 'V3Kd9rrghw',
      assy_design_native_uid: '',
      assy_date_in_hole: '1540536300000000000',
      source: 'EDM',
      assy_sequence_no: '3',
      type: 'Casing',
      assy_report_desc: '14" Casing - TIANDI',
      assy_date_landed: '1174780800000000000',
      wellboreName: 'OCS-G 09981 /GC825-6 (SP5) ST00BP00',
      assy_current_status_date: '1544486400000000000',
      assy_comments: 'LOST 118 BBLS WHILE ATTEMPTING TO CIRCULATE AT LAND OUT.',
      assy_original_md_base: '17509.999836',
      assy_current_status_reason: 'ORIGINAL INSTALL',
      object_state: 'ACTUAL',
      assy_current_status_comment:
        "INSTALLED 08/14/2014 - LPWHH AT 5022' (10' STICKUP) - SHOE AT 5338'",
      assy_current_md_top: '19511.039022',
      assy_hole_size: '18.125',
      assy_event_native_uid: '13urd',
      assy_report_type: 'CASING',
      assy_original_md_top: '4975.769836',
      assy_design_existance_kind: '',
      assy_size: '14.0',
      assy_current_md_base: '19514.06902806',
      datasetName: 'BP-EDM-casing',
      assy_current_status_desc: 'INSTALLED',
      assy_report_date: '1544486400000000000',
      assy_type: 'Casing',
      assy_native_uid: '4i6rv',
      assy_report_native_uid: '1icf5bq6e0',
      parentExternalId: 'USA0000620200',
      assy_cement_jobs_native_uid: 'qjn3s',
      assy_name: '14" Casing - TIANDI',
      assy_design_name: '34580',
    },
    columns: [
      {
        name: 'comp_body_inside_diameter',
        externalId: 'comp_body_inside_diameter',
        valueType: 'DOUBLE',
        metadata: {
          unit: 'in',
        },
        createdTime: '2020-06-19T21:30:48.829Z',
        lastUpdatedTime: '2020-06-19T21:30:48.829Z',
      },
      {
        name: 'comp_body_outside_diameter',
        externalId: 'comp_body_outside_diameter',
        valueType: 'DOUBLE',
        metadata: {
          unit: 'in',
        },
        createdTime: '2020-06-19T21:30:48.829Z',
        lastUpdatedTime: '2020-06-19T21:30:48.829Z',
      },
      {
        name: 'comp_comment',
        externalId: 'comp_comment',
        valueType: 'STRING',
        metadata: {},
        createdTime: '2020-06-19T21:30:48.829Z',
        lastUpdatedTime: '2020-06-19T21:30:48.829Z',
      },
      {
        name: 'comp_description',
        externalId: 'comp_description',
        valueType: 'STRING',
        metadata: {},
        createdTime: '2020-06-19T21:30:48.829Z',
        lastUpdatedTime: '2020-06-19T21:30:48.829Z',
      },
      {
        name: 'comp_drift_inside_diameter',
        externalId: 'comp_drift_inside_diameter',
        valueType: 'DOUBLE',
        metadata: {
          unit: 'in',
        },
        createdTime: '2020-06-19T21:30:48.829Z',
        lastUpdatedTime: '2020-06-19T21:30:48.829Z',
      },
      {
        name: 'comp_grade',
        externalId: 'comp_grade',
        valueType: 'STRING',
        metadata: {},
        createdTime: '2020-06-19T21:30:48.829Z',
        lastUpdatedTime: '2020-06-19T21:30:48.829Z',
      },
      {
        name: 'comp_has_threadlock',
        externalId: 'comp_has_threadlock',
        valueType: 'STRING',
        metadata: {},
        createdTime: '2020-06-19T21:30:48.829Z',
        lastUpdatedTime: '2020-06-19T21:30:48.829Z',
      },
      {
        name: 'comp_joints_no',
        externalId: 'comp_joints_no',
        valueType: 'DOUBLE',
        metadata: {},
        createdTime: '2020-06-19T21:30:48.829Z',
        lastUpdatedTime: '2020-06-19T21:30:48.829Z',
      },
      {
        name: 'comp_length',
        externalId: 'comp_length',
        valueType: 'DOUBLE',
        metadata: {
          unit: 'ft',
        },
        createdTime: '2020-06-19T21:30:48.829Z',
        lastUpdatedTime: '2020-06-19T21:30:48.829Z',
      },
      {
        name: 'comp_manufacturer',
        externalId: 'comp_manufacturer',
        valueType: 'STRING',
        metadata: {},
        createdTime: '2020-06-19T21:30:48.829Z',
        lastUpdatedTime: '2020-06-19T21:30:48.829Z',
      },
      {
        name: 'comp_md_base',
        externalId: 'comp_md_base',
        valueType: 'DOUBLE',
        metadata: {
          unit: 'ft',
        },
        createdTime: '2020-06-19T21:30:48.829Z',
        lastUpdatedTime: '2020-06-19T21:30:48.829Z',
      },
      {
        name: 'comp_md_top',
        externalId: 'comp_md_top',
        valueType: 'DOUBLE',
        metadata: {
          unit: 'ft',
        },
        createdTime: '2020-06-19T21:30:48.829Z',
        lastUpdatedTime: '2020-06-19T21:30:48.829Z',
      },
      {
        name: 'comp_model',
        externalId: 'comp_model',
        valueType: 'STRING',
        metadata: {},
        createdTime: '2020-06-19T21:30:48.829Z',
        lastUpdatedTime: '2020-06-19T21:30:48.829Z',
      },
      {
        name: 'comp_name',
        externalId: 'comp_name',
        valueType: 'STRING',
        metadata: {},
        createdTime: '2020-06-19T21:30:48.829Z',
        lastUpdatedTime: '2020-06-19T21:30:48.829Z',
      },
      {
        name: 'comp_section_type_code',
        externalId: 'comp_section_type_code',
        valueType: 'STRING',
        metadata: {},
        createdTime: '2020-06-19T21:30:48.829Z',
        lastUpdatedTime: '2020-06-19T21:30:48.829Z',
      },
      {
        name: 'comp_sequence_no',
        externalId: 'comp_sequence_no',
        valueType: 'DOUBLE',
        metadata: {},
        createdTime: '2020-06-19T21:30:48.829Z',
        lastUpdatedTime: '2020-06-19T21:30:48.829Z',
      },
      {
        name: 'comp_serial_no',
        externalId: 'comp_serial_no',
        valueType: 'STRING',
        metadata: {},
        createdTime: '2020-06-19T21:30:48.829Z',
        lastUpdatedTime: '2020-06-19T21:30:48.829Z',
      },
      {
        name: 'comp_thread',
        externalId: 'comp_thread',
        valueType: 'STRING',
        metadata: {},
        createdTime: '2020-06-19T21:30:48.829Z',
        lastUpdatedTime: '2020-06-19T21:30:48.829Z',
      },
      {
        name: 'comp_type_code',
        externalId: 'comp_type_code',
        valueType: 'STRING',
        metadata: {},
        createdTime: '2020-06-19T21:30:48.829Z',
        lastUpdatedTime: '2020-06-19T21:30:48.829Z',
      },
      {
        name: 'comp_weight',
        externalId: 'comp_weight',
        valueType: 'DOUBLE',
        metadata: {
          unit: 'ppf',
        },
        createdTime: '2020-06-19T21:30:48.829Z',
        lastUpdatedTime: '2020-06-19T21:30:48.829Z',
      },
    ],
    createdTime: '2020-06-19T21:30:48.829Z',
    lastUpdatedTime: '2020-07-01T09:01:16.663Z',
    dataSetId: 4464571136926873,
  },
  {
    id: 3737284701420410,
    name: 'USA0000620200_7cqv3',
    description: 'EDM Casing',
    assetId: 3449261002359307,
    externalId: 'LiYtLiMUbH_pnxnfnBvnj_7cqv3',
    metadata: {
      assy_min_inside_diameter: '12.413',
      policy_id: 'V3Kd9rrghw',
      assy_design_native_uid: '',
      assy_date_in_hole: '1539572400000000000',
      source: 'EDM',
      assy_sequence_no: '5',
      type: 'Casing',
      assy_report_desc: '9 7/8" Liner - TIANDI',
      assy_date_landed: '1174780800000000000',
      wellboreName: 'OCS-G 09981 /GC825-6 (SP5) ST00BP00',
      assy_current_status_date: '1544486400000000000',
      assy_comments: 'LOST 118 BBLS WHILE ATTEMPTING TO CIRCULATE AT LAND OUT.',
      assy_original_md_base: '25830.999836',
      assy_current_status_reason: 'ORIGINAL INSTALL',
      object_state: 'ACTUAL',
      assy_current_status_comment:
        "INSTALLED 08/14/2014 - LPWHH AT 5022' (10' STICKUP) - SHOE AT 5338'",
      assy_current_md_top: '19511.039022',
      assy_hole_size: '26.0',
      assy_event_native_uid: '13urd',
      assy_report_type: 'CASING',
      assy_original_md_top: '16924.837836',
      assy_design_existance_kind: '',
      assy_size: '9.875',
      assy_current_md_base: '19514.06902806',
      datasetName: 'BP-EDM-casing',
      assy_current_status_desc: 'INSTALLED',
      assy_report_date: '1544486400000000000',
      assy_type: 'Casing',
      assy_native_uid: '7cqv3',
      assy_report_native_uid: '38ouavihnj',
      parentExternalId: 'USA0000620200',
      assy_cement_jobs_native_uid: '705pm,5fugf',
      assy_name: '9 7/8" Liner - TIANDI',
      assy_design_name: '34584',
    },
    columns: [
      {
        name: 'comp_body_inside_diameter',
        externalId: 'comp_body_inside_diameter',
        valueType: 'DOUBLE',
        metadata: {
          unit: 'in',
        },
        createdTime: '2020-06-19T21:32:25.299Z',
        lastUpdatedTime: '2020-06-19T21:32:25.299Z',
      },
      {
        name: 'comp_body_outside_diameter',
        externalId: 'comp_body_outside_diameter',
        valueType: 'DOUBLE',
        metadata: {
          unit: 'in',
        },
        createdTime: '2020-06-19T21:32:25.299Z',
        lastUpdatedTime: '2020-06-19T21:32:25.299Z',
      },
      {
        name: 'comp_comment',
        externalId: 'comp_comment',
        valueType: 'STRING',
        metadata: {},
        createdTime: '2020-06-19T21:32:25.299Z',
        lastUpdatedTime: '2020-06-19T21:32:25.299Z',
      },
      {
        name: 'comp_description',
        externalId: 'comp_description',
        valueType: 'STRING',
        metadata: {},
        createdTime: '2020-06-19T21:32:25.299Z',
        lastUpdatedTime: '2020-06-19T21:32:25.299Z',
      },
      {
        name: 'comp_drift_inside_diameter',
        externalId: 'comp_drift_inside_diameter',
        valueType: 'DOUBLE',
        metadata: {
          unit: 'in',
        },
        createdTime: '2020-06-19T21:32:25.299Z',
        lastUpdatedTime: '2020-06-19T21:32:25.299Z',
      },
      {
        name: 'comp_grade',
        externalId: 'comp_grade',
        valueType: 'STRING',
        metadata: {},
        createdTime: '2020-06-19T21:32:25.299Z',
        lastUpdatedTime: '2020-06-19T21:32:25.299Z',
      },
      {
        name: 'comp_has_threadlock',
        externalId: 'comp_has_threadlock',
        valueType: 'STRING',
        metadata: {},
        createdTime: '2020-06-19T21:32:25.299Z',
        lastUpdatedTime: '2020-06-19T21:32:25.299Z',
      },
      {
        name: 'comp_joints_no',
        externalId: 'comp_joints_no',
        valueType: 'DOUBLE',
        metadata: {},
        createdTime: '2020-06-19T21:32:25.299Z',
        lastUpdatedTime: '2020-06-19T21:32:25.299Z',
      },
      {
        name: 'comp_length',
        externalId: 'comp_length',
        valueType: 'DOUBLE',
        metadata: {
          unit: 'ft',
        },
        createdTime: '2020-06-19T21:32:25.299Z',
        lastUpdatedTime: '2020-06-19T21:32:25.299Z',
      },
      {
        name: 'comp_manufacturer',
        externalId: 'comp_manufacturer',
        valueType: 'STRING',
        metadata: {},
        createdTime: '2020-06-19T21:32:25.299Z',
        lastUpdatedTime: '2020-06-19T21:32:25.299Z',
      },
      {
        name: 'comp_md_base',
        externalId: 'comp_md_base',
        valueType: 'DOUBLE',
        metadata: {
          unit: 'ft',
        },
        createdTime: '2020-06-19T21:32:25.299Z',
        lastUpdatedTime: '2020-06-19T21:32:25.299Z',
      },
      {
        name: 'comp_md_top',
        externalId: 'comp_md_top',
        valueType: 'DOUBLE',
        metadata: {
          unit: 'ft',
        },
        createdTime: '2020-06-19T21:32:25.299Z',
        lastUpdatedTime: '2020-06-19T21:32:25.299Z',
      },
      {
        name: 'comp_model',
        externalId: 'comp_model',
        valueType: 'STRING',
        metadata: {},
        createdTime: '2020-06-19T21:32:25.299Z',
        lastUpdatedTime: '2020-06-19T21:32:25.299Z',
      },
      {
        name: 'comp_name',
        externalId: 'comp_name',
        valueType: 'STRING',
        metadata: {},
        createdTime: '2020-06-19T21:32:25.299Z',
        lastUpdatedTime: '2020-06-19T21:32:25.299Z',
      },
      {
        name: 'comp_section_type_code',
        externalId: 'comp_section_type_code',
        valueType: 'STRING',
        metadata: {},
        createdTime: '2020-06-19T21:32:25.299Z',
        lastUpdatedTime: '2020-06-19T21:32:25.299Z',
      },
      {
        name: 'comp_sequence_no',
        externalId: 'comp_sequence_no',
        valueType: 'DOUBLE',
        metadata: {},
        createdTime: '2020-06-19T21:32:25.299Z',
        lastUpdatedTime: '2020-06-19T21:32:25.299Z',
      },
      {
        name: 'comp_serial_no',
        externalId: 'comp_serial_no',
        valueType: 'STRING',
        metadata: {},
        createdTime: '2020-06-19T21:32:25.299Z',
        lastUpdatedTime: '2020-06-19T21:32:25.299Z',
      },
      {
        name: 'comp_thread',
        externalId: 'comp_thread',
        valueType: 'STRING',
        metadata: {},
        createdTime: '2020-06-19T21:32:25.299Z',
        lastUpdatedTime: '2020-06-19T21:32:25.299Z',
      },
      {
        name: 'comp_type_code',
        externalId: 'comp_type_code',
        valueType: 'STRING',
        metadata: {},
        createdTime: '2020-06-19T21:32:25.299Z',
        lastUpdatedTime: '2020-06-19T21:32:25.299Z',
      },
      {
        name: 'comp_weight',
        externalId: 'comp_weight',
        valueType: 'DOUBLE',
        metadata: {
          unit: 'ppf',
        },
        createdTime: '2020-06-19T21:32:25.299Z',
        lastUpdatedTime: '2020-06-19T21:32:25.299Z',
      },
    ],
    createdTime: '2020-06-19T21:32:25.299Z',
    lastUpdatedTime: '2020-07-01T07:56:19.893Z',
    dataSetId: 4464571136926873,
  },
]

export const bpLogs = {}

export const bpLogsFrmTops = {
  '3449261002359307': [],
}

export const bpNdsEvents = [
  {
    externalId: 'eeedfa60-f1fd-4a51-abc1-38bca73e5151',
    dataSetId: 8317389766030068,
    startTime: 0,
    subtype: 'Directional drilling',
    description:
      'These are the two zones: 21,325-21,361-ft. MD and 21,387 to 21,408-ft MD. with RT resistivity responses which may be bad data points and not formation related, or possible indication of fluid invasion to the formation.',
    metadata: {
      country: 'COU0000000250',
      md_hole_start: '21325.0',
      hidden: 'false',
      tvd_offset_hole_end: '19082.57',
      lithology: 'Unknown',
      formation: '',
      tvd_offset_hole_start: '19048.1',
      md_hole_end_unit: 'ft',
      type: 'Risk',
      md_hole_end: '21365.0',
      tvd_offset_hole_start_unit: 'ft',
      lastUpdated: '2020-04-23T13:21:27.1245560+00:00',
      archived: 'false',
      end_well_top: '',
      tvd_offset_hole_end_unit: 'ft',
      details:
        "This risk was part of a bulk import on 23/04/2020 14:20:53.\r\n'StartTime' had value '1899/12/30T00:00:00' (which is invalid) when it was uploaded.\r\n'EndTime' had value '1899/12/30T00:00:00' (which is invalid) when it was uploaded.\r\nDirectional commenced drop at this time, tools exhibited an erratic response with resistivity, null data, and spikes.Potentially there are two fractures in those two zones either induced or related to fault.",
      well_name: 'GC825_6_RT (SP5)',
      start_well_top: '',
      geological_period: 'Unknown',
      root_cause: 'Unknown',
      severity: '1',
      summary:
        'These are the two zones: 21,325-21,361-ft. MD and 21,387 to 21,408-ft MD. with RT resistivity responses which may be bad data points and not formation related, or possible indication of fluid invasion to the formation.',
      lastUpdatedBy: 'kieran.uzzell1@bp.com',
      md_hole_start_unit: 'ft',
      probability: '3',
      duration_unit: 'hrs',
      further_analysis: '',
      field_name: 'ARA000000000137',
      parentExternalId: 'USA0000620200',
      root_cause_details: '',
      diameter_hole_unit: 'in',
      name: 'Potential Weak Formation',
      contingency: '',
      risk_sub_category: 'Abnormal tendency changes',
      diameter_hole: '12 1/4"',
      region: 'BUS0000000007',
      operation: 'Unknown',
    },
    assetIds: [3449261002359307],
    source: 'NDS',
    id: 1009349064490502,
    lastUpdatedTime: '2020-10-13T13:50:55.077Z',
    createdTime: '2020-05-12T19:27:14.039Z',
  },
  {
    externalId: 'fb3009f7-dad5-4abe-b594-45e9a971b9c1',
    dataSetId: 8317389766030068,
    startTime: 0,
    subtype: 'Directional drilling',
    description: 'Reduced ROP due to misunderstanding procedure.',
    metadata: {
      country: 'COU0000000250',
      md_hole_start: '15956.0',
      hidden: 'false',
      tvd_offset_hole_end: '14923.49',
      lithology: 'Unknown',
      formation: '',
      tvd_offset_hole_start: '14687.48',
      md_hole_end_unit: 'ft',
      type: 'Risk',
      md_hole_end: '16250.0',
      tvd_offset_hole_start_unit: 'ft',
      lastUpdated: '2020-04-23T13:21:27.1245500+00:00',
      archived: 'false',
      end_well_top: '',
      tvd_offset_hole_end_unit: 'ft',
      details:
        "This risk was part of a bulk import on 23/04/2020 14:20:53.\r\n'StartTime' had value '1899/12/30T00:00:00' (which is invalid) when it was uploaded.\r\n'EndTime' had value '1899/12/30T00:00:00' (which is invalid) when it was uploaded.",
      well_name: 'GC825_6_RT (SP5)',
      start_well_top: '',
      geological_period: 'Unknown',
      root_cause: 'Unknown',
      severity: '1',
      summary: 'Reduced ROP due to misunderstanding procedure.',
      lastUpdatedBy: 'kieran.uzzell1@bp.com',
      md_hole_start_unit: 'ft',
      probability: '3',
      duration_unit: 'hrs',
      further_analysis: '',
      field_name: 'ARA000000000137',
      parentExternalId: 'USA0000620200',
      root_cause_details: '',
      diameter_hole_unit: 'in',
      name: 'Reduce ROP',
      contingency: '',
      risk_sub_category: 'Drilling optimization',
      diameter_hole: '18 1/8',
      region: 'BUS0000000007',
      operation: 'Unknown',
    },
    assetIds: [3449261002359307],
    source: 'NDS',
    id: 1339660935659493,
    lastUpdatedTime: '2020-10-13T13:51:00.983Z',
    createdTime: '2020-05-12T19:27:14.039Z',
  },
  {
    externalId: '62b25b5f-f18e-455f-8f06-a4dc322468d3',
    dataSetId: 8317389766030068,
    startTime: 0,
    subtype: 'Wellbore stability',
    description:
      '23,850-ft MD Cuttings/Cavings\u000b1-2% tabular to splintered cavings',
    metadata: {
      country: 'COU0000000250',
      md_hole_start: '23100.0',
      hidden: 'false',
      tvd_offset_hole_end: '20778.09',
      lithology: 'Unknown',
      formation: '',
      tvd_offset_hole_start: '20680.99',
      md_hole_end_unit: 'ft',
      type: 'Risk',
      md_hole_end: '23200.0',
      tvd_offset_hole_start_unit: 'ft',
      lastUpdated: '2020-04-23T13:21:27.1245606+00:00',
      archived: 'false',
      end_well_top: '',
      tvd_offset_hole_end_unit: 'ft',
      details:
        "This risk was part of a bulk import on 23/04/2020 14:20:53.\r\n'StartTime' had value '1899/12/30T00:00:00' (which is invalid) when it was uploaded.\r\n'EndTime' had value '1899/12/30T00:00:00' (which is invalid) when it was uploaded.\r\nContinued observation of this tupe of tabular caving in this hole section.  Believed to be kock off from the wellbore during the drop.  Deviation in 12.25-in hole section is 35-deg hold then drop to 15-deg hold through reservoir.",
      well_name: 'GC825_6_RT (SP5)',
      start_well_top: '',
      geological_period: 'Unknown',
      root_cause: 'Unknown',
      severity: '1',
      summary:
        '23,850-ft MD Cuttings/Cavings\u000b1-2% tabular to splintered cavings',
      lastUpdatedBy: 'kieran.uzzell1@bp.com',
      md_hole_start_unit: 'ft',
      probability: '3',
      duration_unit: 'hrs',
      further_analysis: '',
      field_name: 'ARA000000000137',
      parentExternalId: 'USA0000620200',
      root_cause_details: '',
      diameter_hole_unit: 'in',
      name: 'Tabular Caving (1%)',
      contingency: '',
      risk_sub_category: 'Breakouts',
      region: 'BUS0000000007',
      operation: 'Unknown',
    },
    assetIds: [3449261002359307],
    source: 'NDS',
    id: 1859611274911606,
    lastUpdatedTime: '2020-10-13T13:51:09.964Z',
    createdTime: '2020-05-12T19:27:14.039Z',
  },
  {
    externalId: '21a8eae8-b9b2-4f5a-9340-a77c76c41d15',
    dataSetId: 8317389766030068,
    startTime: 0,
    subtype: 'Other',
    description: '36-in conductor built to1.6-deg. while jetting.',
    metadata: {
      country: 'COU0000000250',
      md_hole_start: '5200.0',
      hidden: 'false',
      tvd_offset_hole_end: '5334.97',
      lithology: 'Unknown',
      formation: '',
      tvd_offset_hole_start: '5200.0',
      md_hole_end_unit: 'ft',
      type: 'Risk',
      md_hole_end: '5335.0',
      tvd_offset_hole_start_unit: 'ft',
      lastUpdated: '2020-04-23T13:21:27.1245428+00:00',
      archived: 'false',
      end_well_top: '',
      tvd_offset_hole_end_unit: 'ft',
      details:
        "This risk was part of a bulk import on 23/04/2020 14:20:53.\r\n'StartTime' had value '1899/12/30T00:00:00' (which is invalid) when it was uploaded.\r\n'EndTime' had value '1899/12/30T00:00:00' (which is invalid) when it was uploaded.\r\nDrilling the 26-in hole section deviation was brought back to vertical.",
      well_name: 'GC825_6_RT (SP5)',
      start_well_top: '',
      geological_period: 'Unknown',
      root_cause: 'Unknown',
      severity: '1',
      summary: '36-in conductor built to1.6-deg. while jetting.',
      lastUpdatedBy: 'kieran.uzzell1@bp.com',
      md_hole_start_unit: 'ft',
      probability: '3',
      duration_unit: 'hrs',
      further_analysis: '',
      field_name: 'ARA000000000137',
      parentExternalId: 'USA0000620200',
      root_cause_details: '',
      diameter_hole_unit: 'in',
      name: 'Conductor Inclination Build',
      contingency: '',
      risk_sub_category: 'Stratigraphy',
      region: 'BUS0000000007',
      operation: 'Unknown',
    },
    assetIds: [3449261002359307],
    source: 'NDS',
    id: 3491613564234690,
    lastUpdatedTime: '2020-10-13T13:51:35.010Z',
    createdTime: '2020-05-12T19:27:14.039Z',
  },
  {
    externalId: 'd6bbb32c-da44-4671-b4b0-a22f8c8fe9b3',
    dataSetId: 8317389766030068,
    startTime: 0,
    subtype: 'Directional drilling',
    description:
      'These are the two zones: 21,325-21,361-ft. MD and 21,387 to 21,408-ft MD. with RT resistivity responses which may be bad data points and not formation related, or possible indication of fluid invasion to the formation.',
    metadata: {
      country: 'COU0000000250',
      md_hole_start: '21390.0',
      hidden: 'false',
      tvd_offset_hole_end: '19121.49',
      lithology: 'Unknown',
      formation: '',
      tvd_offset_hole_start: '19104.16',
      md_hole_end_unit: 'ft',
      type: 'Risk',
      md_hole_end: '21410.0',
      tvd_offset_hole_start_unit: 'ft',
      lastUpdated: '2020-04-23T13:21:27.1245572+00:00',
      archived: 'false',
      end_well_top: '',
      tvd_offset_hole_end_unit: 'ft',
      details:
        "This risk was part of a bulk import on 23/04/2020 14:20:53.\r\n'StartTime' had value '1899/12/30T00:00:00' (which is invalid) when it was uploaded.\r\n'EndTime' had value '1899/12/30T00:00:00' (which is invalid) when it was uploaded.\r\nDirectional commenced drop at this time, tools exhibited an erratic response with resistivity, null data, and spikes. .Potentially there are two fractures in those two zones either induced or related to fault.",
      well_name: 'GC825_6_RT (SP5)',
      start_well_top: '',
      geological_period: 'Unknown',
      root_cause: 'Unknown',
      severity: '1',
      summary:
        'These are the two zones: 21,325-21,361-ft. MD and 21,387 to 21,408-ft MD. with RT resistivity responses which may be bad data points and not formation related, or possible indication of fluid invasion to the formation.',
      lastUpdatedBy: 'kieran.uzzell1@bp.com',
      md_hole_start_unit: 'ft',
      probability: '3',
      duration_unit: 'hrs',
      further_analysis: '',
      field_name: 'ARA000000000137',
      parentExternalId: 'USA0000620200',
      root_cause_details: '',
      diameter_hole_unit: 'in',
      name: 'Potential Weak Formation',
      contingency: '',
      risk_sub_category: 'Abnormal tendency changes',
      diameter_hole: '12 1/4"',
      region: 'BUS0000000007',
      operation: 'Unknown',
    },
    assetIds: [3449261002359307],
    source: 'NDS',
    id: 4499761332003462,
    lastUpdatedTime: '2020-10-13T13:51:47.247Z',
    createdTime: '2020-05-12T19:27:14.039Z',
  },
  {
    externalId: '5732afa0-a0cb-485b-98a0-a3fa98f6f92e',
    dataSetId: 8317389766030068,
    startTime: 0,
    subtype: 'Directional drilling',
    description: 'Increase Torque and Weight on Bit.',
    metadata: {
      country: 'COU0000000250',
      md_hole_start: '14498.58',
      hidden: 'false',
      tvd_offset_hole_end: '14682.66',
      lithology: 'Unknown',
      formation: '',
      tvd_offset_hole_start: '13516.3',
      md_hole_end_unit: 'ft',
      type: 'Risk',
      md_hole_end: '15950.0',
      tvd_offset_hole_start_unit: 'ft',
      lastUpdated: '2020-04-23T13:21:27.1245489+00:00',
      archived: 'false',
      end_well_top: '',
      tvd_offset_hole_end_unit: 'ft',
      details:
        "This risk was part of a bulk import on 23/04/2020 14:20:53.\r\n'StartTime' had value '1899/12/30T00:00:00' (which is invalid) when it was uploaded.\r\n'EndTime' had value '1899/12/30T00:00:00' (which is invalid) when it was uploaded.\r\nThe increase of TQ and WOB correlates to Seq3 through to MPU.  Through this interval the sonic exhibits speeding up, indicating a lithological change to an increase CACO3 in the stratigraphy.",
      well_name: 'GC825_6_RT (SP5)',
      start_well_top: '',
      geological_period: 'Unknown',
      root_cause: 'Unknown',
      severity: '1',
      summary: 'Increase Torque and Weight on Bit.',
      lastUpdatedBy: 'kieran.uzzell1@bp.com',
      md_hole_start_unit: 'ft',
      probability: '4',
      duration_unit: 'hrs',
      further_analysis: '',
      field_name: 'ARA000000000137',
      parentExternalId: 'USA0000620200',
      root_cause_details: '',
      diameter_hole_unit: 'in',
      name: 'Increase Torque',
      contingency: '',
      risk_sub_category: 'Abnormal tendency changes',
      diameter_hole: '18 1/8',
      region: 'BUS0000000007',
      operation: 'Unknown',
    },
    assetIds: [3449261002359307],
    source: 'NDS',
    id: 5197237865697401,
    lastUpdatedTime: '2020-10-13T13:52:01.090Z',
    createdTime: '2020-05-12T19:27:14.039Z',
  },
  {
    externalId: '97e3bd41-7b80-47a4-95b4-28daa35f8c76',
    dataSetId: 8317389766030068,
    startTime: 0,
    subtype: 'Directional drilling',
    description: 'Increase Torque.',
    metadata: {
      country: 'COU0000000250',
      md_hole_start: '5875.11',
      hidden: 'false',
      tvd_offset_hole_end: '6070.0',
      lithology: 'Unknown',
      formation: '',
      tvd_offset_hole_start: '5875.0',
      md_hole_end_unit: 'ft',
      type: 'Risk',
      md_hole_end: '6070.11',
      tvd_offset_hole_start_unit: 'ft',
      lastUpdated: '2020-04-23T13:21:27.1245643+00:00',
      archived: 'false',
      end_well_top: '',
      tvd_offset_hole_end_unit: 'ft',
      details:
        "This risk was part of a bulk import on 23/04/2020 14:20:53.\r\n'StartTime' had value '1899/12/30T00:00:00' (which is invalid) when it was uploaded.\r\n'EndTime' had value '1899/12/30T00:00:00' (which is invalid) when it was uploaded.\r\nThe increase of TQ and WOB correlates to Seq3 through to MPU.  Through this interval the sonic exhibits speeding up, indicating a lithological change to an increase CACO3 in the stratigraphy.",
      well_name: 'GC825_6_RT (SP5)',
      start_well_top: '',
      geological_period: 'Unknown',
      root_cause: 'Unknown',
      severity: '1',
      summary: 'Increase Torque.',
      lastUpdatedBy: 'kieran.uzzell1@bp.com',
      md_hole_start_unit: 'ft',
      probability: '4',
      duration_unit: 'hrs',
      further_analysis: '',
      field_name: 'ARA000000000137',
      parentExternalId: 'USA0000620200',
      root_cause_details: '',
      diameter_hole_unit: 'in',
      name: 'Increase Torque',
      contingency: '',
      risk_sub_category: 'Abnormal tendency changes',
      diameter_hole: '18 1/8',
      region: 'BUS0000000007',
      operation: 'Unknown',
    },
    assetIds: [3449261002359307],
    source: 'NDS',
    id: 5328605368277590,
    lastUpdatedTime: '2020-10-13T13:52:04.786Z',
    createdTime: '2020-05-12T19:27:14.039Z',
  },
  {
    externalId: '98caa375-5b86-4dfa-bec9-2dbfed1b1dd1',
    dataSetId: 8317389766030068,
    startTime: 0,
    subtype: 'Wellbore stability',
    description:
      '23,850-ft MD Cuttings/Cavings 1-2% tabular to splintered cavings',
    metadata: {
      country: 'COU0000000250',
      md_hole_start: '23350.0',
      hidden: 'false',
      tvd_offset_hole_end: '21752.94',
      lithology: 'Unknown',
      formation: '',
      tvd_offset_hole_start: '20924.09',
      md_hole_end_unit: 'ft',
      type: 'Risk',
      md_hole_end: '24200.0',
      tvd_offset_hole_start_unit: 'ft',
      lastUpdated: '2020-04-23T13:21:27.1245617+00:00',
      archived: 'false',
      end_well_top: '',
      tvd_offset_hole_end_unit: 'ft',
      details:
        "This risk was part of a bulk import on 23/04/2020 14:20:53.\r\n'StartTime' had value '1899/12/30T00:00:00' (which is invalid) when it was uploaded.\r\n'EndTime' had value '1899/12/30T00:00:00' (which is invalid) when it was uploaded.\r\nContinued observation of this tupe of tabular caving in this hole section.  Believed to be kock off from the wellbore during the drop.  Deviation in 12.25-in hole section is 35-deg hold then drop to 15-deg hold through reservoir.",
      well_name: 'GC825_6_RT (SP5)',
      start_well_top: '',
      geological_period: 'Unknown',
      root_cause: 'Unknown',
      severity: '1',
      summary:
        '23,850-ft MD Cuttings/Cavings 1-2% tabular to splintered cavings',
      lastUpdatedBy: 'kieran.uzzell1@bp.com',
      md_hole_start_unit: 'ft',
      probability: '3',
      duration_unit: 'hrs',
      further_analysis: '',
      field_name: 'ARA000000000137',
      parentExternalId: 'USA0000620200',
      root_cause_details: '',
      diameter_hole_unit: 'in',
      name: 'Tabular Caving (1-2%)',
      contingency: '',
      risk_sub_category: 'Breakouts',
      diameter_hole: '12 1/4"',
      region: 'BUS0000000007',
      operation: 'Unknown',
    },
    assetIds: [3449261002359307],
    source: 'NDS',
    id: 5793055467086009,
    lastUpdatedTime: '2020-10-13T13:52:13.126Z',
    createdTime: '2020-05-12T19:27:14.039Z',
  },
  {
    externalId: 'da1582e9-183f-4281-9ce0-571ac8b05e68',
    dataSetId: 8317389766030068,
    startTime: 0,
    subtype: 'Hydraulics',
    description:
      'N Seq Sand high to prognosis and gas bearing exhibited 645-units.',
    metadata: {
      country: 'COU0000000250',
      md_hole_start: '18634.25',
      hidden: 'false',
      tvd_offset_hole_end: '16940.13',
      lithology: 'Unknown',
      formation: '',
      tvd_offset_hole_start: '16844.82',
      md_hole_end_unit: 'ft',
      type: 'Risk',
      md_hole_end: '18752.0',
      tvd_offset_hole_start_unit: 'ft',
      lastUpdated: '2020-04-23T13:21:27.1245549+00:00',
      archived: 'false',
      end_well_top: '',
      tvd_offset_hole_end_unit: 'ft',
      details:
        "This risk was part of a bulk import on 23/04/2020 14:20:53.\r\n'StartTime' had value '1899/12/30T00:00:00' (which is invalid) when it was uploaded.\r\n'EndTime' had value '1899/12/30T00:00:00' (which is invalid) when it was uploaded.\r\nMW was adequate for this event, no indication of WBS or PPFG related event.  This did impact the zonal isolation plan for the 14-in casing cementation program.",
      well_name: 'GC825_6_RT (SP5)',
      start_well_top: '',
      geological_period: 'Unknown',
      root_cause: 'Unknown',
      severity: '1',
      summary:
        'N Seq Sand high to prognosis and gas bearing exhibited 645-units.',
      lastUpdatedBy: 'kieran.uzzell1@bp.com',
      md_hole_start_unit: 'ft',
      probability: '2',
      duration_unit: 'hrs',
      further_analysis: '',
      field_name: 'ARA000000000137',
      parentExternalId: 'USA0000620200',
      root_cause_details: '',
      diameter_hole_unit: 'in',
      name: 'Elevated Formation Gas',
      contingency: '',
      risk_sub_category: 'Other influx or kicks',
      diameter_hole: '12 1/4"',
      region: 'BUS0000000007',
      operation: 'Unknown',
    },
    assetIds: [3449261002359307],
    source: 'NDS',
    id: 6225938568629511,
    lastUpdatedTime: '2020-10-13T13:52:21.560Z',
    createdTime: '2020-05-12T19:27:14.039Z',
  },
  {
    externalId: '4e7a9d17-e922-432d-bba8-687639a3d5fc',
    dataSetId: 8317389766030068,
    startTime: 0,
    subtype: 'Directional drilling',
    description: 'Reduced ROP due to misunderstanding procedure.',
    metadata: {
      country: 'COU0000000250',
      md_hole_start: '17323.0',
      hidden: 'false',
      tvd_offset_hole_end: '16095.88',
      lithology: 'Unknown',
      formation: '',
      tvd_offset_hole_start: '15787.51',
      md_hole_end_unit: 'ft',
      type: 'Risk',
      md_hole_end: '17707.0',
      tvd_offset_hole_start_unit: 'ft',
      lastUpdated: '2020-04-23T13:21:27.1245534+00:00',
      archived: 'false',
      end_well_top: '',
      tvd_offset_hole_end_unit: 'ft',
      details:
        "This risk was part of a bulk import on 23/04/2020 14:20:53.\r\n'StartTime' had value '1899/12/30T00:00:00' (which is invalid) when it was uploaded.\r\n'EndTime' had value '1899/12/30T00:00:00' (which is invalid) when it was uploaded.",
      well_name: 'GC825_6_RT (SP5)',
      start_well_top: '',
      geological_period: 'Unknown',
      root_cause: 'Unknown',
      severity: '1',
      summary: 'Reduced ROP due to misunderstanding procedure.',
      lastUpdatedBy: 'kieran.uzzell1@bp.com',
      md_hole_start_unit: 'ft',
      probability: '1',
      duration_unit: 'hrs',
      further_analysis: '',
      field_name: 'ARA000000000137',
      parentExternalId: 'USA0000620200',
      root_cause_details: '',
      diameter_hole_unit: 'in',
      name: 'Reduce ROP for TD Selection',
      contingency: '',
      risk_sub_category: 'Drilling optimization',
      region: 'BUS0000000007',
      operation: 'Unknown',
    },
    assetIds: [3449261002359307],
    source: 'NDS',
    id: 6299453235449942,
    lastUpdatedTime: '2020-10-13T13:52:22.967Z',
    createdTime: '2020-05-12T19:27:14.039Z',
  },
  {
    externalId: '1bd28a91-aa92-4bdd-800e-de448b00a1e2',
    dataSetId: 8317389766030068,
    startTime: 0,
    subtype: 'Directional drilling',
    description: 'Dogleg  greater than 2-deg below the 36-in conductor.',
    metadata: {
      country: 'COU0000000250',
      md_hole_start: '5335.0',
      hidden: 'false',
      tvd_offset_hole_end: '5499.93',
      lithology: 'Unknown',
      formation: '',
      tvd_offset_hole_start: '5334.97',
      md_hole_end_unit: 'ft',
      type: 'Risk',
      md_hole_end: '5500.0',
      tvd_offset_hole_start_unit: 'ft',
      lastUpdated: '2020-04-23T13:21:27.1245439+00:00',
      archived: 'false',
      end_well_top: '',
      tvd_offset_hole_end_unit: 'ft',
      details:
        "This risk was part of a bulk import on 23/04/2020 14:20:53.\r\n'StartTime' had value '1899/12/30T00:00:00' (which is invalid) when it was uploaded.\r\n'EndTime' had value '1899/12/30T00:00:00' (which is invalid) when it was uploaded.\r\nDuring jetting operations 36-in conductor build to 1.5-deg.  Drilling ahead with teh 26-in hole section the well was brought back to vertical.",
      well_name: 'GC825_6_RT (SP5)',
      start_well_top: '',
      geological_period: 'Unknown',
      root_cause: 'Unknown',
      severity: '1',
      summary: 'Dogleg  greater than 2-deg below the 36-in conductor.',
      lastUpdatedBy: 'kieran.uzzell1@bp.com',
      md_hole_start_unit: 'ft',
      probability: '3',
      duration_unit: 'hrs',
      further_analysis: '',
      field_name: 'ARA000000000137',
      parentExternalId: 'USA0000620200',
      root_cause_details: '',
      diameter_hole_unit: 'in',
      name: 'Dog Leg Greater than 2-deg',
      contingency: '',
      risk_sub_category: 'Excessive doglegs',
      diameter_hole: '26"',
      region: 'BUS0000000007',
      operation: 'Unknown',
    },
    assetIds: [3449261002359307],
    source: 'NDS',
    id: 6786892508622861,
    lastUpdatedTime: '2020-10-13T13:52:29.718Z',
    createdTime: '2020-05-12T19:27:14.039Z',
  },
  {
    externalId: 'ac3b1707-5054-4b4d-a675-30abd1f807fe',
    dataSetId: 8317389766030068,
    startTime: 0,
    subtype: 'Wellbore stability',
    description:
      '23,850-ft MD Cuttings/Cavings 1-2% tabular to splintered cavings',
    metadata: {
      country: 'COU0000000250',
      md_hole_start: '24190.0',
      hidden: 'false',
      tvd_offset_hole_end: '23448.39',
      lithology: 'Unknown',
      formation: '',
      tvd_offset_hole_start: '21743.23',
      md_hole_end_unit: 'ft',
      type: 'Risk',
      md_hole_end: '25940.0',
      tvd_offset_hole_start_unit: 'ft',
      lastUpdated: '2020-04-23T13:21:27.1245628+00:00',
      archived: 'false',
      end_well_top: '',
      tvd_offset_hole_end_unit: 'ft',
      details:
        "This risk was part of a bulk import on 23/04/2020 14:20:53.\r\n'StartTime' had value '1899/12/30T00:00:00' (which is invalid) when it was uploaded.\r\n'EndTime' had value '1899/12/30T00:00:00' (which is invalid) when it was uploaded.\r\nContinued observation of this tupe of tabular caving in this hole section.  Believed to be kock off from the wellbore during the drop.  Deviation in 12.25-in hole section is 35-deg hold then drop to 15-deg hold through reservoir.",
      well_name: 'GC825_6_RT (SP5)',
      start_well_top: '',
      geological_period: 'Unknown',
      root_cause: 'Unknown',
      severity: '1',
      summary:
        '23,850-ft MD Cuttings/Cavings 1-2% tabular to splintered cavings',
      lastUpdatedBy: 'kieran.uzzell1@bp.com',
      md_hole_start_unit: 'ft',
      probability: '3',
      duration_unit: 'hrs',
      further_analysis: '',
      field_name: 'ARA000000000137',
      parentExternalId: 'USA0000620200',
      root_cause_details: '',
      diameter_hole_unit: 'in',
      name: 'Tabular Caving (1%)',
      contingency: '',
      risk_sub_category: 'Breakouts',
      region: 'BUS0000000007',
      operation: 'Unknown',
    },
    assetIds: [3449261002359307],
    source: 'NDS',
    id: 6811289954896203,
    lastUpdatedTime: '2020-10-13T13:52:30.583Z',
    createdTime: '2020-05-12T19:27:14.039Z',
  },
  {
    externalId: 'c0fd17da-c0b0-4a5f-8c0d-7d7763a43173',
    dataSetId: 8317389766030068,
    startTime: 0,
    subtype: 'Directional drilling',
    description:
      'Trip for bit, unable to achieve desired directional build angle.',
    metadata: {
      country: 'COU0000000250',
      md_hole_start: '8070.0',
      hidden: 'false',
      tvd_offset_hole_end: '8079.84',
      lithology: 'Unknown',
      formation: '',
      tvd_offset_hole_start: '8069.84',
      md_hole_end_unit: 'ft',
      type: 'Risk',
      md_hole_end: '8080.0',
      tvd_offset_hole_start_unit: 'ft',
      lastUpdated: '2020-04-23T13:21:27.1245477+00:00',
      archived: 'false',
      end_well_top: '',
      tvd_offset_hole_end_unit: 'ft',
      details:
        "This risk was part of a bulk import on 23/04/2020 14:20:53.\r\n'StartTime' had value '1899/12/30T00:00:00' (which is invalid) when it was uploaded.\r\n'EndTime' had value '1899/12/30T00:00:00' (which is invalid) when it was uploaded.\r\nChange out BHA reconfigured",
      well_name: 'GC825_6_RT (SP5)',
      start_well_top: '',
      geological_period: 'Unknown',
      root_cause: 'Unknown',
      severity: '1',
      summary:
        'Trip for bit, unable to achieve desired directional build angle.',
      lastUpdatedBy: 'kieran.uzzell1@bp.com',
      md_hole_start_unit: 'ft',
      probability: '4',
      duration_unit: 'hrs',
      further_analysis: '',
      field_name: 'ARA000000000137',
      parentExternalId: 'USA0000620200',
      root_cause_details: '',
      diameter_hole_unit: 'in',
      name: 'Trip for BHA/Bit',
      contingency: '',
      risk_sub_category: 'BHA change for directional',
      region: 'BUS0000000007',
      operation: 'Unknown',
    },
    assetIds: [3449261002359307],
    source: 'NDS',
    id: 7147082827605633,
    lastUpdatedTime: '2020-10-13T13:52:35.558Z',
    createdTime: '2020-05-12T19:27:14.039Z',
  },
  {
    externalId: 'be111cf2-62df-4c2e-bf8e-9615fb8f20a7',
    dataSetId: 8317389766030068,
    startTime: 0,
    subtype: 'Directional drilling',
    description:
      'SP5 directional issues in 18.125" hole, unable to achieve desired build hole angle.',
    metadata: {
      country: 'COU0000000250',
      md_hole_start: '7700.0',
      hidden: 'false',
      tvd_offset_hole_end: '8079.84',
      lithology: 'Unknown',
      formation: '',
      tvd_offset_hole_start: '7699.89',
      md_hole_end_unit: 'ft',
      type: 'Risk',
      md_hole_end: '8080.0',
      tvd_offset_hole_start_unit: 'ft',
      lastUpdated: '2020-04-23T13:21:27.1245466+00:00',
      archived: 'false',
      end_well_top: '',
      tvd_offset_hole_end_unit: 'ft',
      details:
        "This risk was part of a bulk import on 23/04/2020 14:20:53.\r\n'StartTime' had value '1899/12/30T00:00:00' (which is invalid) when it was uploaded.\r\n'EndTime' had value '1899/12/30T00:00:00' (which is invalid) when it was uploaded.\r\nDirectionally drilled the 18.125-in. hole from 7,650-ft .MD to 8,219-ft. MD (unable to adequately build hole angle).  Given issue building angle with the BHA, decision is made to trip out of hole and change bit, power drive and modify stabilizer placement.",
      well_name: 'GC825_6_RT (SP5)',
      start_well_top: '',
      geological_period: 'Unknown',
      root_cause: 'Unknown',
      severity: '2',
      summary:
        'SP5 directional issues in 18.125" hole, unable to achieve desired build hole angle.',
      lastUpdatedBy: 'kieran.uzzell1@bp.com',
      md_hole_start_unit: 'ft',
      probability: '3',
      duration_unit: 'hrs',
      further_analysis: '',
      field_name: 'ARA000000000137',
      parentExternalId: 'USA0000620200',
      root_cause_details: '',
      diameter_hole_unit: 'in',
      name: 'Unable to Build Angle',
      contingency: '',
      risk_sub_category: 'Bit or BHA performance',
      region: 'BUS0000000007',
      operation: 'Unknown',
    },
    assetIds: [3449261002359307],
    source: 'NDS',
    id: 7247377637143334,
    lastUpdatedTime: '2020-10-13T13:52:37.558Z',
    createdTime: '2020-05-12T19:27:14.039Z',
  },
  {
    externalId: '964da391-1c16-4c6f-acb7-ef9edf4b34a3',
    dataSetId: 8317389766030068,
    startTime: 0,
    subtype: 'Completion',
    description: 'Rat hole below 22" casing',
    metadata: {
      country: 'COU0000000250',
      md_hole_start: '7650.0',
      hidden: 'false',
      tvd_offset_hole_end: '7699.89',
      lithology: 'Unknown',
      formation: '',
      tvd_offset_hole_start: '7649.89',
      md_hole_end_unit: 'ft',
      type: 'Risk',
      md_hole_end: '7700.0',
      tvd_offset_hole_start_unit: 'ft',
      lastUpdated: '2020-04-23T13:21:27.1245454+00:00',
      archived: 'false',
      end_well_top: '',
      tvd_offset_hole_end_unit: 'ft',
      details:
        "This risk was part of a bulk import on 23/04/2020 14:20:53.\r\n'StartTime' had value '1899/12/30T00:00:00' (which is invalid) when it was uploaded.\r\n'EndTime' had value '1899/12/30T00:00:00' (which is invalid) when it was uploaded.",
      well_name: 'GC825_6_RT (SP5)',
      start_well_top: '',
      geological_period: 'Unknown',
      root_cause: 'Unknown',
      severity: '1',
      summary: 'Rat hole below 22" casing',
      lastUpdatedBy: 'kieran.uzzell1@bp.com',
      md_hole_start_unit: 'ft',
      probability: '2',
      duration_unit: 'hrs',
      further_analysis: '',
      field_name: 'ARA000000000137',
      parentExternalId: 'USA0000620200',
      root_cause_details: '',
      diameter_hole_unit: 'in',
      name: 'Rat Hole',
      contingency: '',
      risk_sub_category: 'Broaching',
      region: 'BUS0000000007',
      operation: 'Unknown',
    },
    assetIds: [3449261002359307],
    source: 'NDS',
    id: 7278551887115212,
    lastUpdatedTime: '2020-10-13T13:52:38.295Z',
    createdTime: '2020-05-12T19:27:14.039Z',
  },
  {
    externalId: 'c29493ea-18b6-48d5-87d2-ee7c9a482bd1',
    dataSetId: 8317389766030068,
    startTime: 0,
    subtype: 'Mechanical',
    description:
      'Commence Trip out of hole, started to POOH at 08:10hrs this morning- appear to be seeing drag first 2 stands out, had to turn pumps on both stands.  No further issues after the first few stands.',
    metadata: {
      country: 'COU0000000250',
      md_hole_start: '15800.0',
      hidden: 'false',
      tvd_offset_hole_end: '14722.8',
      lithology: 'Unknown',
      formation: '',
      tvd_offset_hole_start: '14562.26',
      md_hole_end_unit: 'ft',
      type: 'Risk',
      md_hole_end: '16000.0',
      tvd_offset_hole_start_unit: 'ft',
      lastUpdated: '2020-04-23T13:21:27.1245523+00:00',
      archived: 'false',
      end_well_top: '',
      tvd_offset_hole_end_unit: 'ft',
      details:
        "This risk was part of a bulk import on 23/04/2020 14:20:53.\r\n'StartTime' had value '1899/12/30T00:00:00' (which is invalid) when it was uploaded.\r\n'EndTime' had value '1899/12/30T00:00:00' (which is invalid) when it was uploaded.",
      well_name: 'GC825_6_RT (SP5)',
      start_well_top: '',
      geological_period: 'Unknown',
      root_cause: 'Unknown',
      severity: '1',
      summary:
        'Commence Trip out of hole, started to POOH at 08:10hrs this morning- appear to be seeing drag first 2 stands out, had to turn pumps on both stands.  No further issues after the first few stands.',
      lastUpdatedBy: 'kieran.uzzell1@bp.com',
      md_hole_start_unit: 'ft',
      probability: '3',
      duration_unit: 'hrs',
      further_analysis: '',
      field_name: 'ARA000000000137',
      parentExternalId: 'USA0000620200',
      root_cause_details: '',
      diameter_hole_unit: 'in',
      name: 'Overpull Trip Out',
      contingency: '',
      risk_sub_category: 'Tight hole or overpull',
      region: 'BUS0000000007',
      operation: 'Unknown',
    },
    assetIds: [3449261002359307],
    source: 'NDS',
    id: 7389625901073753,
    lastUpdatedTime: '2020-10-13T13:52:39.523Z',
    createdTime: '2020-05-12T19:27:14.039Z',
  },
  {
    externalId: '23b1d95e-81d5-4ff1-930f-2abe8ca5b41d',
    dataSetId: 8317389766030068,
    startTime: 0,
    subtype: 'Directional drilling',
    description: 'Increase Torque and Weight on Bit.',
    metadata: {
      country: 'COU0000000250',
      md_hole_start: '16260.0',
      hidden: 'false',
      tvd_offset_hole_end: '15766.98',
      lithology: 'Unknown',
      formation: '',
      tvd_offset_hole_start: '14931.54',
      md_hole_end_unit: 'ft',
      type: 'Risk',
      md_hole_end: '17297.5',
      tvd_offset_hole_start_unit: 'ft',
      lastUpdated: '2020-04-23T13:21:27.1245511+00:00',
      archived: 'false',
      end_well_top: '',
      tvd_offset_hole_end_unit: 'ft',
      details:
        "This risk was part of a bulk import on 23/04/2020 14:20:53.\r\n'StartTime' had value '1899/12/30T00:00:00' (which is invalid) when it was uploaded.\r\n'EndTime' had value '1899/12/30T00:00:00' (which is invalid) when it was uploaded.\r\nThe increase of TQ and WOB correlates to Seq3 through to MPU.  Through this interval the sonic exhibits speeding up, indicating a lithological change to an increase CACO3 in the stratigraphy.",
      well_name: 'GC825_6_RT (SP5)',
      start_well_top: '',
      geological_period: 'Unknown',
      root_cause: 'Unknown',
      severity: '1',
      summary: 'Increase Torque and Weight on Bit.',
      lastUpdatedBy: 'kieran.uzzell1@bp.com',
      md_hole_start_unit: 'ft',
      probability: '4',
      duration_unit: 'hrs',
      further_analysis: '',
      field_name: 'ARA000000000137',
      parentExternalId: 'USA0000620200',
      root_cause_details: '',
      diameter_hole_unit: 'in',
      name: 'Increase Torque',
      contingency: '',
      risk_sub_category: 'Abnormal tendency changes',
      diameter_hole: '18 1/8',
      region: 'BUS0000000007',
      operation: 'Unknown',
    },
    assetIds: [3449261002359307],
    source: 'NDS',
    id: 7397700999484942,
    lastUpdatedTime: '2020-10-13T13:52:39.694Z',
    createdTime: '2020-05-12T19:27:14.039Z',
  },
  {
    externalId: '9150ac1e-0834-4e59-aa2e-edae9432cddb',
    dataSetId: 8317389766030068,
    startTime: 0,
    subtype: 'Directional drilling',
    description: 'ROP reduction when approaching the V sand.',
    metadata: {
      country: 'COU0000000250',
      md_hole_start: '22246.0',
      hidden: 'false',
      tvd_offset_hole_end: '21282.49',
      lithology: 'Unknown',
      formation: '',
      tvd_offset_hole_start: '19871.52',
      md_hole_end_unit: 'ft',
      type: 'Risk',
      md_hole_end: '23717.0',
      tvd_offset_hole_start_unit: 'ft',
      lastUpdated: '2020-04-23T13:21:27.1245583+00:00',
      archived: 'false',
      end_well_top: '',
      tvd_offset_hole_end_unit: 'ft',
      details:
        "This risk was part of a bulk import on 23/04/2020 14:20:53.\r\n'StartTime' had value '1899/12/30T00:00:00' (which is invalid) when it was uploaded.\r\n'EndTime' had value '1899/12/30T00:00:00' (which is invalid) when it was uploaded.",
      well_name: 'GC825_6_RT (SP5)',
      start_well_top: '',
      geological_period: 'Unknown',
      root_cause: 'Unknown',
      severity: '1',
      summary: 'ROP reduction when approaching the V sand.',
      lastUpdatedBy: 'kieran.uzzell1@bp.com',
      md_hole_start_unit: 'ft',
      probability: '1',
      duration_unit: 'hrs',
      further_analysis: '',
      field_name: 'ARA000000000137',
      parentExternalId: 'USA0000620200',
      root_cause_details: '',
      diameter_hole_unit: 'in',
      name: 'Reduce ROP V Seq - 70-fph',
      contingency: '',
      risk_sub_category: 'Drilling optimization',
      region: 'BUS0000000007',
      operation: 'Unknown',
    },
    assetIds: [3449261002359307],
    source: 'NDS',
    id: 7462028638681027,
    lastUpdatedTime: '2020-10-13T13:52:41.105Z',
    createdTime: '2020-05-12T19:27:14.039Z',
  },
  {
    externalId: 'd3f4dad4-2942-49ba-905a-84f9d711d7eb',
    dataSetId: 8317389766030068,
    startTime: 0,
    subtype: 'Wellbore stability',
    description:
      'Cuttings Report: 22,680-ft. MD observaion; handpicked tabular caving (mechanical origin?) <1%',
    metadata: {
      country: 'COU0000000250',
      md_hole_start: '22600.0',
      hidden: 'false',
      tvd_offset_hole_end: '20277.55',
      lithology: 'Unknown',
      formation: '',
      tvd_offset_hole_start: '20201.89',
      md_hole_end_unit: 'ft',
      type: 'Risk',
      md_hole_end: '22680.0',
      tvd_offset_hole_start_unit: 'ft',
      lastUpdated: '2020-04-23T13:21:27.1245594+00:00',
      archived: 'false',
      end_well_top: '',
      tvd_offset_hole_end_unit: 'ft',
      details:
        "This risk was part of a bulk import on 23/04/2020 14:20:53.\r\n'StartTime' had value '1899/12/30T00:00:00' (which is invalid) when it was uploaded.\r\n'EndTime' had value '1899/12/30T00:00:00' (which is invalid) when it was uploaded.\r\n1st occurance of this tupe of tabular caving in this hole section.  Believed to be kock off from the wellbore during the drop.  Deviation in 12.25-in hole section is 35-deg hold then drop to 15-deg hold through reservoir.",
      well_name: 'GC825_6_RT (SP5)',
      start_well_top: '',
      geological_period: 'Unknown',
      root_cause: 'Unknown',
      severity: '1',
      summary:
        'Cuttings Report: 22,680-ft. MD observaion; handpicked tabular caving (mechanical origin?) <1%',
      lastUpdatedBy: 'kieran.uzzell1@bp.com',
      md_hole_start_unit: 'ft',
      probability: '2',
      duration_unit: 'hrs',
      further_analysis: '',
      field_name: 'ARA000000000137',
      parentExternalId: 'USA0000620200',
      root_cause_details: '',
      diameter_hole_unit: 'in',
      name: 'Tabular Caving (very rare)',
      contingency: '',
      risk_sub_category: 'Breakouts',
      diameter_hole: '12 1/4"',
      region: 'BUS0000000007',
      operation: 'Unknown',
    },
    assetIds: [3449261002359307],
    source: 'NDS',
    id: 8109350615002669,
    lastUpdatedTime: '2020-10-13T13:52:50.762Z',
    createdTime: '2020-05-12T19:27:14.039Z',
  },
]

export const bpNptEvents = [
  {
    externalId: 'rfunh',
    dataSetId: 7788182229523559,
    startTime: 1538958600000,
    endTime: 1539216000000,
    subtype: 'WAIT',
    description: 'WAIT ON WEATHER ( HURRICANE MICHAEL )',
    metadata: {
      description: 'WAIT ON WEATHER ( HURRICANE MICHAEL )',
      npt_level: '1.0',
      type: 'NPT',
      npt_code: 'WAIT',
      npt_detail_code: 'WTHR',
      total_npt_duration_hrs: '71.5',
      npt_md: '5253.010506',
      parentExternalId: 'USA0000620200',
      wellboreName: 'OCS-G 09981 /GC825-6 (SP5) ST00BP00',
      created_date: '2018-10-09T02:21:54',
      updated_date: '2018-10-16T05:49:59',
      failure_location: '',
      root_cause: '',
      npt_description: 'WAIT ON WEATHER ( HURRICANE MICHAEL )',
    },
    assetIds: [3449261002359307],
    source: 'EDM-NPT',
    id: 5442443419552197,
    lastUpdatedTime: '2020-08-19T16:45:34.257Z',
    createdTime: '2020-05-12T22:05:33.519Z',
  },
  {
    externalId: 'bdYdm',
    dataSetId: 7788182229523559,
    startTime: 1539862200000,
    endTime: 1539865800000,
    subtype: 'RREP',
    description: 'POWER MANAGEMENT',
    metadata: {
      description: 'POWER MANAGEMENT',
      npt_level: '1.0',
      type: 'NPT',
      npt_code: 'RREP',
      npt_detail_code: 'EPSS',
      total_npt_duration_hrs: '1.0',
      npt_md: '7618.015236',
      parentExternalId: 'USA0000620200',
      wellboreName: 'OCS-G 09981 /GC825-6 (SP5) ST00BP00',
      created_date: '2018-10-19T05:15:11',
      updated_date: '2018-10-19T05:19:20',
      failure_location: '',
      root_cause: '',
      npt_description:
        'WHILE RIH YELLOW ALERT ON POWER MANGEMENT INDICATED. SPACE OUT TOOL JOINT IN BOP. TROUBLESHOOT FAULT.',
    },
    assetIds: [3449261002359307],
    source: 'EDM-NPT',
    id: 3244293651111076,
    lastUpdatedTime: '2020-08-19T16:45:34.703Z',
    createdTime: '2020-05-12T22:05:33.519Z',
  },
  {
    externalId: 'a4FnK',
    dataSetId: 7788182229523559,
    startTime: 1539926100000,
    endTime: 1539939600000,
    subtype: 'WAIT',
    description: 'SCHLUMBERGER DRILLING JARS',
    metadata: {
      description: 'SCHLUMBERGER DRILLING JARS',
      npt_level: '1.0',
      type: 'NPT',
      npt_code: 'WAIT',
      npt_detail_code: 'EQPT',
      total_npt_duration_hrs: '3.75',
      npt_md: '7618.015236',
      parentExternalId: 'USA0000620200',
      wellboreName: 'OCS-G 09981 /GC825-6 (SP5) ST00BP00',
      created_date: '2018-10-20T05:36:25',
      updated_date: '2018-10-20T05:38:10',
      failure_location: '',
      root_cause: '',
      npt_description:
        'WAITING ON SCHLUMBERGER / SMITH - DRILLING JARS TO ARRIVE ON LOCATION, PICK UP / MAKE UP DRILLING JARS TO BHA.',
    },
    assetIds: [3449261002359307],
    source: 'EDM-NPT',
    id: 4183904562239945,
    lastUpdatedTime: '2020-08-19T16:45:34.850Z',
    createdTime: '2020-05-12T22:05:33.519Z',
  },
  {
    externalId: 'wdJml',
    dataSetId: 7788182229523559,
    startTime: 1540032300000,
    endTime: 1540034100000,
    subtype: 'DFAL',
    description: 'UNSCHEDULED DIRECTIONAL SURVEY',
    metadata: {
      description: 'UNSCHEDULED DIRECTIONAL SURVEY',
      npt_level: '1.0',
      type: 'NPT',
      npt_code: 'DFAL',
      npt_detail_code: 'BHA',
      total_npt_duration_hrs: '0.5',
      npt_md: '7968.015936',
      parentExternalId: 'USA0000620200',
      wellboreName: 'OCS-G 09981 /GC825-6 (SP5) ST00BP00',
      created_date: '2018-10-21T06:51:14',
      updated_date: '2018-10-21T06:55:19',
      failure_location: '',
      root_cause: '',
      npt_description: 'TAKE SURVEY CHECK SHOT DUE TO POWER DRIVE PERFORMANCE',
    },
    assetIds: [3449261002359307],
    source: 'EDM-NPT',
    id: 8937411894824497,
    lastUpdatedTime: '2020-08-19T16:45:35.007Z',
    createdTime: '2020-05-12T22:05:33.519Z',
  },
  {
    externalId: 'jVJkC',
    dataSetId: 7788182229523559,
    startTime: 1540037700000,
    endTime: 1540039500000,
    subtype: 'DFAL',
    description: 'UNSCHEDULED DIRECTIONAL SURVEY',
    metadata: {
      description: 'UNSCHEDULED DIRECTIONAL SURVEY',
      npt_level: '1.0',
      type: 'NPT',
      npt_code: 'DFAL',
      npt_detail_code: 'BHA',
      total_npt_duration_hrs: '0.5',
      npt_md: '8063.016126',
      parentExternalId: 'USA0000620200',
      wellboreName: 'OCS-G 09981 /GC825-6 (SP5) ST00BP00',
      created_date: '2018-10-21T06:53:56',
      updated_date: '2018-10-21T06:55:54',
      failure_location: '',
      root_cause: '',
      npt_description: 'TAKE SURVEY CHECK SHOT DUE TO POWER DRIVE PERFORMANCE',
    },
    assetIds: [3449261002359307],
    source: 'EDM-NPT',
    id: 5081621146922796,
    lastUpdatedTime: '2020-08-19T16:45:35.149Z',
    createdTime: '2020-05-12T22:05:33.519Z',
  },
  {
    externalId: 'K03L8',
    dataSetId: 7788182229523559,
    startTime: 1540041300000,
    endTime: 1540111500000,
    subtype: 'DFAL',
    description: 'UNABLE TO BUILD ANGLE WITH POWER DRIVE.',
    metadata: {
      description: 'UNABLE TO BUILD ANGLE WITH POWER DRIVE.',
      npt_level: '1.0',
      type: 'NPT',
      npt_code: 'DFAL',
      npt_detail_code: 'BHA',
      total_npt_duration_hrs: '19.5',
      npt_md: '8137.016274',
      parentExternalId: 'USA0000620200',
      wellboreName: 'OCS-G 09981 /GC825-6 (SP5) ST00BP00',
      created_date: '2018-10-21T03:29:05',
      updated_date: '2018-10-22T01:40:23',
      failure_location: '',
      root_cause: '',
      npt_description: 'UNABLE TO BUILD ANGLE WITH POWER DRIVE.',
    },
    assetIds: [3449261002359307],
    source: 'EDM-NPT',
    id: 7007144864095380,
    lastUpdatedTime: '2020-08-19T16:45:35.297Z',
    createdTime: '2020-05-12T22:05:33.519Z',
  },
  {
    externalId: 'St7Pd',
    dataSetId: 7788182229523559,
    startTime: 1540350000000,
    endTime: 1540366200000,
    subtype: 'SFAL',
    description: 'OVER TORQUED CONNECTIONS.',
    metadata: {
      description: 'OVER TORQUED CONNECTIONS.',
      npt_level: '1.0',
      type: 'NPT',
      npt_code: 'SFAL',
      npt_detail_code: 'DSTH',
      total_npt_duration_hrs: '4.5',
      npt_md: '10845.02169',
      parentExternalId: 'USA0000620200',
      wellboreName: 'OCS-G 09981 /GC825-6 (SP5) ST00BP00',
      created_date: '2018-10-25T01:11:05',
      updated_date: '2018-10-25T01:17:48',
      failure_location: '',
      root_cause: '',
      npt_description:
        'UNABLE TO BREAK CONNECTIONS ON WORKSTRINGS RENTAL 6 5/8" 27# V150 XT-57 DRILL PIPE DUE TO OVER TORQUING. CONNECTIONS HAD TO BE HEATED USING ROSEBUD TORCH.',
    },
    assetIds: [3449261002359307],
    source: 'EDM-NPT',
    id: 8581525009611500,
    lastUpdatedTime: '2020-08-19T16:45:35.464Z',
    createdTime: '2020-05-12T22:05:33.519Z',
  },
  {
    externalId: 'gcPnI',
    dataSetId: 7788182229523559,
    startTime: 1540367100000,
    endTime: 1540381500000,
    subtype: 'SFAL',
    description: 'OVER TORQUED CONNECTIONS.',
    metadata: {
      description: 'OVER TORQUED CONNECTIONS.',
      npt_level: '1.0',
      type: 'NPT',
      npt_code: 'SFAL',
      npt_detail_code: 'DSTH',
      total_npt_duration_hrs: '4.0',
      npt_md: '7522.015044',
      parentExternalId: 'USA0000620200',
      wellboreName: 'OCS-G 09981 /GC825-6 (SP5) ST00BP00',
      created_date: '2018-10-25T01:17:59',
      updated_date: '2018-10-25T01:19:13',
      failure_location: '',
      root_cause: '',
      npt_description:
        'UNABLE TO BREAK CONNECTIONS ON WORKSTRINGS RENTAL 6 5/8" 27# V150 XT-57 DRILL PIPE DUE TO OVER TORQUING. CONNECTIONS HAD TO BE HEATED USING ROSEBUD TORCH.',
    },
    assetIds: [3449261002359307],
    source: 'EDM-NPT',
    id: 7795589500866642,
    lastUpdatedTime: '2020-08-19T16:45:35.609Z',
    createdTime: '2020-05-12T22:05:33.519Z',
  },
  {
    externalId: '4vZAw',
    dataSetId: 7788182229523559,
    startTime: 1540386000000,
    endTime: 1540397700000,
    subtype: 'SFAL',
    description: 'OVER TORQUED CONNECTIONS.',
    metadata: {
      description: 'OVER TORQUED CONNECTIONS.',
      npt_level: '1.0',
      type: 'NPT',
      npt_code: 'SFAL',
      npt_detail_code: 'DSTH',
      total_npt_duration_hrs: '3.25',
      npt_md: '7522.015044',
      parentExternalId: 'USA0000620200',
      wellboreName: 'OCS-G 09981 /GC825-6 (SP5) ST00BP00',
      created_date: '2018-10-25T01:19:30',
      updated_date: '2018-10-25T01:20:39',
      failure_location: '',
      root_cause: '',
      npt_description:
        'UNABLE TO BREAK CONNECTIONS ON WORKSTRINGS RENTAL 6 5/8" 27# V150 XT-57 DRILL PIPE DUE TO OVER TORQUING. CONNECTIONS HAD TO BE HEATED USING ROSEBUD TORCH.',
    },
    assetIds: [3449261002359307],
    source: 'EDM-NPT',
    id: 7420036149482954,
    lastUpdatedTime: '2020-08-19T16:45:35.760Z',
    createdTime: '2020-05-12T22:05:33.519Z',
  },
  {
    externalId: 'SXDa1',
    dataSetId: 7788182229523559,
    startTime: 1540449900000,
    endTime: 1540452600000,
    subtype: 'RREP',
    description: 'TROUBLE SHOOT AUX HYDRA RACKER',
    metadata: {
      description: 'TROUBLE SHOOT AUX HYDRA RACKER',
      npt_level: '1.0',
      type: 'NPT',
      npt_code: 'RREP',
      npt_detail_code: 'HSYS',
      total_npt_duration_hrs: '0.75',
      npt_md: '3241.006482',
      parentExternalId: 'USA0000620200',
      wellboreName: 'OCS-G 09981 /GC825-6 (SP5) ST00BP00',
      created_date: '2018-10-26T02:48:02',
      updated_date: '2018-10-26T02:49:52',
      failure_location: '',
      root_cause: '',
      npt_description: 'AUX SIDE HYDRA RACKER MAIN HEAD.',
    },
    assetIds: [3449261002359307],
    source: 'EDM-NPT',
    id: 7975710780806219,
    lastUpdatedTime: '2020-08-19T16:45:35.898Z',
    createdTime: '2020-05-12T22:05:33.519Z',
  },
  {
    externalId: 'hQ9cx',
    dataSetId: 7788182229523559,
    startTime: 1540582200000,
    endTime: 1540583100000,
    subtype: 'RREP',
    description: 'DAMAGED HYDRA TONG DIES.',
    metadata: {
      description: 'DAMAGED HYDRA TONG DIES.',
      npt_level: '1.0',
      type: 'NPT',
      npt_code: 'RREP',
      npt_detail_code: 'HSYS',
      total_npt_duration_hrs: '0.25',
      npt_md: '3401.006802',
      parentExternalId: 'USA0000620200',
      wellboreName: 'OCS-G 09981 /GC825-6 (SP5) ST00BP00',
      created_date: '2018-10-27T01:38:42',
      updated_date: '2018-10-27T01:42:03',
      failure_location: '',
      root_cause: '',
      npt_description:
        'CHANGE OUT HYDRA TONG DIES DUE TO DAMAGE FROM HIGH TORQUE ON LANDING STRING.',
    },
    assetIds: [3449261002359307],
    source: 'EDM-NPT',
    id: 5817257741393647,
    lastUpdatedTime: '2020-08-19T16:45:36.177Z',
    createdTime: '2020-05-12T22:05:33.519Z',
  },
  {
    externalId: 'kfIP9',
    dataSetId: 7788182229523559,
    startTime: 1541476800000,
    endTime: 1541487600000,
    subtype: 'SFAL',
    description: 'MAKE UP CASING CROSSOVER',
    metadata: {
      description: 'MAKE UP CASING CROSSOVER',
      npt_level: '1.0',
      type: 'NPT',
      npt_code: 'SFAL',
      npt_detail_code: 'HSYS',
      total_npt_duration_hrs: '3.0',
      npt_md: '8766.017532',
      parentExternalId: 'USA0000620200',
      wellboreName: 'OCS-G 09981 /GC825-6 (SP5) ST00BP00',
      created_date: '2018-11-06T19:05:23',
      updated_date: '2018-11-06T19:12:01',
      failure_location: '',
      root_cause: '',
      npt_description:
        "ATTEMPT TO MAKE UP 2' PUP CROSSOVER PRIOR TO PICKING UP HANGER. UNABLE TO MAKE UP PUP CROSSOVER DUE TO DAMAGED BOX ON LAST SINGLE PICKED UP.",
    },
    assetIds: [3449261002359307],
    source: 'EDM-NPT',
    id: 6039670879551851,
    lastUpdatedTime: '2020-08-19T16:45:37.049Z',
    createdTime: '2020-05-12T22:05:33.519Z',
  },
  {
    externalId: 'MDZXl',
    dataSetId: 7788182229523559,
    startTime: 1541588400000,
    endTime: 1541713500000,
    subtype: 'CEMT',
    description: 'LOST CIRCULATION',
    metadata: {
      description: 'LOST CIRCULATION',
      npt_level: '1.0',
      type: 'NPT',
      npt_code: 'CEMT',
      npt_detail_code: 'CMTO',
      total_npt_duration_hrs: '34.75',
      npt_md: '25802.051604',
      parentExternalId: 'USA0000620200',
      wellboreName: 'OCS-G 09981 /GC825-6 (SP5) ST00BP00',
      created_date: '2018-11-08T03:49:04',
      updated_date: '2018-11-09T04:09:12',
      failure_location: '',
      root_cause: '',
      npt_description:
        'ATTEMPT TO BREAK OUT BLACKHAWK CEMENT HEAD AND OBSERVED MUD U-TUBING FROM STRING. CLOSED UPPER FOSV MONITORING LOSSES ON TRIP TANK. PREPARE AND PERFORM SQUEEZE JOB',
    },
    assetIds: [3449261002359307],
    source: 'EDM-NPT',
    id: 747934753591666,
    lastUpdatedTime: '2020-08-19T16:45:37.617Z',
    createdTime: '2020-05-12T22:05:33.519Z',
  },
  {
    externalId: 'rIen7',
    dataSetId: 7788182229523559,
    startTime: 1541929500000,
    endTime: 1541930400000,
    subtype: 'SFAL',
    description: 'TROUBLE SHOOT HEAD TENSION ON WIRELINE UNIT.',
    metadata: {
      description: 'TROUBLE SHOOT HEAD TENSION ON WIRELINE UNIT.',
      npt_level: '1.0',
      type: 'NPT',
      npt_code: 'SFAL',
      npt_detail_code: 'LINE',
      total_npt_duration_hrs: '0.25',
      npt_md: '-82.000164',
      parentExternalId: 'USA0000620200',
      wellboreName: 'OCS-G 09981 /GC825-6 (SP5) ST00BP00',
      created_date: '2018-11-11T17:43:20',
      updated_date: '2018-11-11T17:52:17',
      failure_location: '',
      root_cause: '',
      npt_description: 'CHANGE OUT TENSION HEAD.',
    },
    assetIds: [3449261002359307],
    source: 'EDM-NPT',
    id: 2947925432933143,
    lastUpdatedTime: '2020-08-19T16:45:37.790Z',
    createdTime: '2020-05-12T22:05:33.519Z',
  },
  {
    externalId: 'LY68D',
    dataSetId: 7788182229523559,
    startTime: 1542257100000,
    endTime: 1542296640000,
    subtype: 'DFAL',
    description: 'ARCHER PACKER PRESSURE TEST FAILURE',
    metadata: {
      description: 'ARCHER PACKER PRESSURE TEST FAILURE',
      npt_level: '1.0',
      type: 'NPT',
      npt_code: 'DFAL',
      npt_detail_code: 'DEQP',
      total_npt_duration_hrs: '10.9833333333333',
      npt_md: '5910.01182',
      parentExternalId: 'USA0000620200',
      wellboreName: 'OCS-G 09981 /GC825-6 (SP5) ST00BP00',
      created_date: '2018-11-16T03:37:28',
      updated_date: '2018-11-16T05:56:33',
      failure_location: '',
      root_cause: '',
      npt_description:
        'ARCHER PACKER SET AND PRESSURE TESTED. ( FAILED ) POOH W/ PACKER AND REPLACE',
    },
    assetIds: [3449261002359307],
    source: 'EDM-NPT',
    id: 388748882933049,
    lastUpdatedTime: '2020-08-19T16:45:38.084Z',
    createdTime: '2020-05-12T22:05:33.519Z',
  },
  {
    externalId: 'dGLC0',
    dataSetId: 7788182229523559,
    startTime: 1542308400000,
    endTime: 1542506400000,
    subtype: 'RREP',
    description: 'DRAWWORKS MOTOR REPLACEMENT',
    metadata: {
      description: 'DRAWWORKS MOTOR REPLACEMENT',
      npt_level: '1.0',
      type: 'NPT',
      npt_code: 'RREP',
      npt_detail_code: 'HSYS',
      total_npt_duration_hrs: '55.0',
      npt_md: '25861.051722',
      parentExternalId: 'USA0000620200',
      wellboreName: 'OCS-G 09981 /GC825-6 (SP5) ST00BP00',
      created_date: '2018-11-16T05:57:08',
      updated_date: '2018-11-19T05:40:24',
      failure_location: '',
      root_cause: '',
      npt_description: 'REPLACE MOTOR D ON TDX 1250',
    },
    assetIds: [3449261002359307],
    source: 'EDM-NPT',
    id: 3094416933695293,
    lastUpdatedTime: '2020-08-19T16:45:38.293Z',
    createdTime: '2020-05-12T22:05:33.519Z',
  },
]

export const noDataWells = [
    {
        "matchingId": "3e04d1aa-edb5-4d4e-ba32-78c2d25e1bbb",
        "name": "DISCOVER EMPTY WELLBORE",
        "wellMatchingId": "2dc53454-9803-4b06-aeba-0b732b278251",
        "sources": [
            {
                "assetExternalId": "wells/callisto/well-empty/wellbores/wb-empty",
                "sourceName": "callisto"
            }
        ],
        "description": "Test wellbore without any inspect data. This wellbore will be used in Discover e2e tests.",
        "parentWellboreMatchingId": null,
        "datum": {
            "value": 25,
            "unit": "meter",
            "reference": "KB"
        },
        "id": "3e04d1aa-edb5-4d4e-ba32-78c2d25e1bbb",
        "wellId": "2dc53454-9803-4b06-aeba-0b732b278251",
        "sourceWellbores": [
            {
                "id": 0,
                "externalId": "wells/callisto/well-empty/wellbores/wb-empty",
                "source": "callisto"
            }
        ],
        "metadata": {
            "color": "#4255BB",
            "elevation_value_unit": "",
            "elevation_value": "",
            "elevation_type": "KB",
            "bh_x_coordinate": 22.649482,
            "bh_y_coordinate": -92.603144
        },
        "parentId": "2dc53454-9803-4b06-aeba-0b732b278251"
    }
]

export const noDataWellbores = [
    {
        "matchingId": "2dc53454-9803-4b06-aeba-0b732b278251",
        "name": "DISCOVER EMPTY WELL",
        "wellhead": {
            "id": 0,
            "x": 22.649482,
            "y": -92.603144,
            "crs": "EPSG:4326"
        },
        "waterDepth": {
            "value": 2000,
            "unit": "meter"
        },
        "sources": [
            "callisto"
        ],
        "description": "Test well without any wellbores. This well will be used in Discover e2e tests.",
        "country": "Mexico",
        "quadrant": null,
        "region": "Discover",
        "block": null,
        "field": "Gulf of Mexico",
        "operator": "Pretty Polly ASA",
        "spudDate": "2021-11-15T00:00:00.000Z",
        "wellType": "Production",
        "license": null,
        "wellbores": [
            {
                "matchingId": "3e04d1aa-edb5-4d4e-ba32-78c2d25e1bbb",
                "name": "DISCOVER EMPTY WELLBORE",
                "wellMatchingId": "2dc53454-9803-4b06-aeba-0b732b278251",
                "sources": [
                    {
                        "assetExternalId": "wells/callisto/well-empty/wellbores/wb-empty",
                        "sourceName": "callisto"
                    }
                ],
                "description": "Test wellbore without any inspect data. This wellbore will be used in Discover e2e tests.",
                "parentWellboreMatchingId": null,
                "datum": {
                    "value": 25,
                    "unit": "meter",
                    "reference": "KB"
                },
                "id": "3e04d1aa-edb5-4d4e-ba32-78c2d25e1bbb",
                "wellId": "2dc53454-9803-4b06-aeba-0b732b278251",
                "sourceWellbores": [
                    {
                        "id": 0,
                        "externalId": "wells/callisto/well-empty/wellbores/wb-empty",
                        "source": "callisto"
                    }
                ],
                "metadata": {
                    "color": "#4255BB"
                }
            }
        ],
        "id": "2dc53454-9803-4b06-aeba-0b732b278251",
        "_wellbores": [
            {
                "matchingId": "3e04d1aa-edb5-4d4e-ba32-78c2d25e1bbb",
                "name": "DISCOVER EMPTY WELLBORE",
                "wellMatchingId": "2dc53454-9803-4b06-aeba-0b732b278251",
                "sources": [
                    {
                        "assetExternalId": "wells/callisto/well-empty/wellbores/wb-empty",
                        "sourceName": "callisto"
                    }
                ],
                "description": "Test wellbore without any inspect data. This wellbore will be used in Discover e2e tests.",
                "parentWellboreMatchingId": null,
                "datum": {
                    "value": 25,
                    "unit": "meter",
                    "reference": "KB"
                },
                "id": "3e04d1aa-edb5-4d4e-ba32-78c2d25e1bbb",
                "wellId": "2dc53454-9803-4b06-aeba-0b732b278251",
                "sourceWellbores": [
                    {
                        "id": 0,
                        "externalId": "wells/callisto/well-empty/wellbores/wb-empty",
                        "source": "callisto"
                    }
                ]
            }
        ],
        "geometry": {
            "type": "Point",
            "coordinates": [
                22.649482,
                -92.603144
            ]
        },
        "metadata": {
            "x_coordinate": 22.649482,
            "y_coordinate": -92.603144
        }
    }
]