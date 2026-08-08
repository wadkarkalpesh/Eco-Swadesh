/**
 * IoT Actuator & Compressor Controller
 * Lead Architect: Principal Industrial IoT & Embedded Automation Engineer
 */

const iotActuatorEngine = require('../services/iotActuatorEngine');
const db = require('../config/db');

const sendCommand = (req, res) => {
  try {
    const { containerId = 'CONT-REEFER-9921', commandType = 'SET_TARGET_TEMPERATURE', payload = {} } = req.body;

    const result = iotActuatorEngine.sendCommand({
      containerId,
      commandType,
      payload,
    });

    db.logAudit({
      actorId: req.user ? req.user.id : 'cold_chain_operator',
      actorRole: 'iot_dispatcher',
      action: `IOT_ACTUATOR_${commandType}`,
      targetType: 'CONTAINER_ACTUATOR',
      targetId: containerId,
      reason: `Dispatched remote command ${commandType} to container ${containerId}`,
    });

    return res.status(200).json(result);
  } catch (err) {
    return res.status(400).json({ success: false, error: err.message });
  }
};

const getContainerStatus = (req, res) => {
  const { containerId } = req.params;
  const state = iotActuatorEngine.getContainerState(containerId);

  if (!state) {
    return res.status(404).json({ success: false, error: 'CONTAINER_NOT_FOUND' });
  }

  return res.status(200).json({
    success: true,
    containerState: state,
    recentCommands: iotActuatorEngine.getCommandLogs(containerId),
  });
};

module.exports = {
  sendCommand,
  getContainerStatus,
};
