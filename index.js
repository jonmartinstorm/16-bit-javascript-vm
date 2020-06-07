const createMemory = require("./create-memory");
const CPU = require("./cpu");
const instructions = require("./instructions");

const memory = createMemory(256);
const writableBytes = new Uint8Array(memory.buffer);

const cpu = new CPU(memory);

writableBytes[0] = instructions.MOV_LIT_R1;
writableBytes[1] = 0x12;
writableBytes[2] = 0x34;

writableBytes[3] = instructions.MOV_LIT_R2;
writableBytes[4] = 0xab;
writableBytes[5] = 0xcd;

writableBytes[6] = instructions.ADD_REG_REG;
writableBytes[7] = 2; // r1 register (0 is ip, and 1 is acc, so r1 is 2.)
writableBytes[8] = 3; // r2 register

cpu.debug();

cpu.step();
cpu.debug();

cpu.step();
cpu.debug();

cpu.step();
cpu.debug();