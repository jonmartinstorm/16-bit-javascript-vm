const createMemory = require("./create-memory");
const instructions = require("./instructions");

class CPU {
    constructor(memory) {
        this.memory = memory;

        this.registerNames = [
            "ip", "acc",
            "r1", "r2", "r3", "r4",
            "r5", "r6", "r7", "r8",
        ];

        this.registers = createMemory(this.registerNames.length * 2);

        this.registerMap = this.registerNames.reduce((map, name, i) => {
            map[name] = i * 2;
            return map;
        }, {});

    }

    debug() {
        this.registerNames.forEach(name => {
            console.log(`${name}:\t0x${this.getRegister(name).toString(16).padStart(4, "0")}`);
            
        });
        console.log();
    }

    viewMemoryAt(address) {
        const nextEightBytes = Array.from({length: 8}, (_, i) => 
            this.memory.getUint8(address + i)
        ).map(v => `0x${v.toString(16).padStart(2, "0")}`);

        console.log(`0x${address.toString(16).padStart(4, "0")}: ${nextEightBytes.join(" ")}`);
    }

    getRegister(name) {
        if (!(name in this.registerMap)) {
            throw new Error(`getRegister: No such register '${name}'`);
        }
        return this.registers.getUint16(this.registerMap[name]);
    }

    setRegister(name, value) {
        if (!(name in this.registerMap)) {
            throw new Error(`setRegister: No such register '${name}'`);
        }
        return this.registers.setUint16(this.registerMap[name], value);
    }

    fetch() {
        const nextInstructionAddress = this.getRegister("ip");
        const instruction = this.memory.getUint8(nextInstructionAddress);
        this.setRegister("ip", nextInstructionAddress + 1);
        return instruction;
    }

    fetch16() {
        const nextInstructionAddress = this.getRegister("ip");
        const instruction = this.memory.getUint16(nextInstructionAddress);
        this.setRegister("ip", nextInstructionAddress + 2);
        return instruction;
    }

    execute(instruction) {
        switch (instruction) {
            // move literal into register
            case instructions.MOV_LIT_REG: {
                const literal = this.fetch16();
                const register = (this.fetch() % this.registerNames.length) * 2;
                this.registers.setUint16(register, literal);
                return;
            }

            // move register into register
            case instructions.MOV_REG_REG: {
                const registerFrom = (this.fetch() % this.registerNames.length) * 2;
                const registerTo = (this.fetch() % this.registerNames.length) * 2;
                const value = this.registers.getUint16(registerFrom);
                this.registers.setUint16(registerTo, value);
                return;
            }

            // move register into memory
            case instructions.MOV_REG_MEM: {
                const registerFrom = (this.fetch() % this.registerNames.length) * 2;
                const address = this.fetch16();
                const value = this.registers.getUint16(registerFrom);
                this.memory.setUint16(address, value);
                return;
            }

            // move memory into register
            case instructions.MOV_MEM_REG: {
                const address = this.fetch16();
                const registerTo = (this.fetch() % this.registerNames.length) * 2;
                const value = this.memory.getUint16(address);
                this.registers.setUint16(registerTo, value);
                return;
            }

            // add reg and reg and put in acc
            case instructions.ADD_REG_REG: {
                const reg1 = this.fetch();
                const reg2 = this.fetch();
                const regsisterValue1 = this.registers.getUint16(reg1 * 2);
                const regsisterValue2 = this.registers.getUint16(reg2 * 2);
                this.setRegister("acc", regsisterValue1 + regsisterValue2);
                return;
            }

            // jump if not equal
            case instructions.JMP_NOT_EQ: {
                const value = this.fetch16();
                const address = this.fetch16();

                if (value != this.getRegister("acc")) {
                    this.setRegister("ip", address);
                }

                return;
            }
        }
    }

    step() {
        const instruction = this.fetch();
        return this.execute(instruction);
    }
}

module.exports = CPU;