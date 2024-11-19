import fz from '../converters/fromZigbee';
import tz from '../converters/toZigbee';
import * as exposes from '../lib/exposes';
import * as utils from '../lib/utils';
import {DefinitionWithExtend, Fz, Tz} from '../lib/types';

const e = exposes.presets;
const ea = exposes.access;

const fzLocal = {
    multistate_input: {
        cluster: 'genMultistateInput',
        type: ['attributeReport', 'readResponse'],
        options: [exposes.options.precision('present_value')],
        convert: (model, msg, publish, options, meta) => {
            const value = msg.data['presentValue'];
            if (value !== undefined) {
                const endpointName = utils.getKey(model.endpoint(meta.device), msg.endpoint.ID);
                return { [endpointName]: value };
            }
        },
    } satisfies Fz.Converter,
    multistate_output: {
        cluster: 'genMultistateOutput',
        type: ['attributeReport', 'readResponse'],
        options: [exposes.options.precision('present_value')],
        convert: (model, msg, publish, options, meta) => {
            const value = msg.data['presentValue'];
            if (value !== undefined) {
                const endpointName = utils.getKey(model.endpoint(meta.device), msg.endpoint.ID);
                return { [endpointName]: value };
            }
        },
    } satisfies Fz.Converter,
};

const tzLocal = {
    multistate_input: {
        key: [
            'target_tilt_angle_head',
            'current_tilt_angle_head',
            'target_tilt_angle_foot',
            'current_tilt_angle_foot',
            'head_massage_intensity',
            'foot_massage_intensity',
            'massage_duration',
        ],
        convertSet: async (entity, key: string, value, meta) => {
            const cluster = 'genMultistateInput';
            const attribute = 'presentValue';
            await entity.write(cluster, { [attribute]: value }, { manufacturerCode: null });
            return { state: { [key]: value } };
        },
    } satisfies Tz.Converter,
};

const definitions: DefinitionWithExtend[] = [
    {
        zigbeeModel: ['Bed.box'],
        model: 'Bed.box',
        vendor: 'Sprut.device',
        description: 'Smart bed with adjustable features',
        fromZigbee: [fz.on_off, fzLocal.multistate_input, fzLocal.multistate_output],
        toZigbee: [tz.on_off, tzLocal.multistate_input],
        exposes: [
                e.numeric('target_tilt_angle_head', ea.SET)
                .withEndpoint('target_tilt_angle_head')
                .withValueMin(0)
                .withValueMax(100)
                .withValueStep(1)
                .withDescription('Set the target tilt angle of the head section'),
            e.numeric('current_tilt_angle_head', ea.STATE)
                .withEndpoint('current_tilt_angle_head')
                .withValueMin(0)
                .withValueMax(100)
                .withDescription('Current tilt angle of the head section'),
            e.numeric('target_tilt_angle_foot', ea.SET)
                .withEndpoint('target_tilt_angle_foot')
                .withValueMin(0)
                .withValueMax(100)
                .withValueStep(1)
                .withDescription('Set the target tilt angle of the foot section'),
            e.numeric('current_tilt_angle_foot', ea.STATE)
                .withEndpoint('current_tilt_angle_foot')
                .withValueMin(0)
                .withValueMax(100)
                .withDescription('Current tilt angle of the foot section'),
            e.switch()
                .withEndpoint('light')
                .withDescription('Control bed lighting'),
            e.switch()
                .withEndpoint('massage')
                .withDescription('Toggle massage feature'),
            e.switch()
                .withEndpoint('spectator_mode')
                .withDescription('Activate spectator mode'),
            e.switch()
                .withEndpoint('sleep_mode')
                .withDescription('Activate sleep mode'),
            e.switch()
                .withEndpoint('zero_gravity')
                .withDescription('Activate zero gravity mode'),
            e.switch()
                .withEndpoint('reading_mode')
                .withDescription('Activate reading mode'),
            e.switch()
                .withEndpoint('anti_snore')
                .withDescription('Activate anti-snore feature'),
            e.switch()
                .withEndpoint('compression')
                .withDescription('Activate compression feature'),
            e.switch()
                .withEndpoint('freeze_position')
                .withDescription('Freeze current bed position'),
            e.numeric('head_massage_intensity', ea.ALL)
                .withEndpoint('head_massage_intensity')
                .withValueMin(0)
                .withValueMax(6)
                .withDescription('Set intensity of head massage (0-6)'),
            e.numeric('foot_massage_intensity', ea.ALL)
                .withEndpoint('foot_massage_intensity')
                .withValueMin(0)
                .withValueMax(6)
                .withDescription('Set intensity of foot massage (0-6)'),
            e.numeric('massage_duration', ea.ALL)
                .withEndpoint('massage_duration')
                .withValueMin(0)
                .withValueMax(3)
                .withDescription('Set duration of massage (0=Off, 1=10min, 2=20min, 3=30min)'),
        ],
        endpoint: (device) => {
            return {
                target_tilt_angle_head: 2,
                current_tilt_angle_head: 11,
                target_tilt_angle_foot: 3,
                current_tilt_angle_foot: 12,
                light: 1,
                massage: 21,
                spectator_mode: 10,
                sleep_mode: 7,
                zero_gravity: 8,
                reading_mode: 9,
                anti_snore: 24,
                compression: 26,
                freeze_position: 27,
                head_massage_intensity: 4,
                foot_massage_intensity: 5,
                massage_duration: 6,
            };
        },
    }
];

export default definitions;
module.exports = definitions;
