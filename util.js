var crypto = require('crypto')

// convert file size to human readable
function humanFileSize(bytes, si) {
    var thresh = si ? 1000 : 1024;
    if(Math.abs(bytes) < thresh) {
        return bytes + ' B';
    }
    var units = si
        ? ['kB','MB','GB','TB','PB','EB','ZB','YB']
        : ['KiB','MiB','GiB','TiB','PiB','EiB','ZiB','YiB'];
    var u = -1;
    do {
        bytes /= thresh;
        ++u;
    } while(Math.abs(bytes) >= thresh && u < units.length - 1);
    return bytes.toFixed(1)+' '+units[u];
}

// generate a uid
var uid_count = 0
function getUid() {
  return (++uid_count) + '-' + crypto.randomBytes(16).toString('hex')
}

function memoryUsage() {
    var stats = process.memoryUsage()
    Object.keys(stats).forEach(stat => {
        stats[stat] = humanFileSize(stats[stat])
    })
    return stats
}

module.exports = {
    humanFileSize: humanFileSize,
    getUid: getUid,
    memoryUsage: memoryUsage
}