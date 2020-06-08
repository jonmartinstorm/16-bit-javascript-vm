# Programs written for testing the vm

## Count to three
```
//start:
let i = 0x0000;  // program start

// mov #0x0100, r1
writableBytes[i++] = instructions.MOV_MEM_REG;
writableBytes[i++] = 0x01;
writableBytes[i++] = 0x00;
writableBytes[i++] = R1;

// mov 0x0001, r2
writableBytes[i++] = instructions.MOV_LIT_REG;
writableBytes[i++] = 0x00;
writableBytes[i++] = 0x01;
writableBytes[i++] = R2;

// add r1, r2
writableBytes[i++] = instructions.ADD_REG_REG;
writableBytes[i++] = R1;
writableBytes[i++] = R2;

// mov acc, #0x0100
writableBytes[i++] = instructions.MOV_REG_MEM;
writableBytes[i++] = ACC;
writableBytes[i++] = 0x01;
writableBytes[i++] = 0x00; // 0x0100

//jne 0x0003, start:
writableBytes[i++] = instructions.JMP_NOT_EQ;
writableBytes[i++] = 0x00;
writableBytes[i++] = 0x03;
writableBytes[i++] = 0x00;
writableBytes[i++] = 0x00;
```

## Swap registers using stack
```
let i = 0x0000;  // program start

// mov $5151, r1
writableBytes[i++] = instructions.MOV_LIT_REG;
writableBytes[i++] = 0x51;
writableBytes[i++] = 0x51;
writableBytes[i++] = R1;

// mov $4242, r2
writableBytes[i++] = instructions.MOV_LIT_REG;
writableBytes[i++] = 0x42;
writableBytes[i++] = 0x42;
writableBytes[i++] = R2;

// psh r1
writableBytes[i++] = instructions.PSH_REG;
writableBytes[i++] = R1;

// psh r2
writableBytes[i++] = instructions.PSH_REG;
writableBytes[i++] = R2;

// pop r1
writableBytes[i++] = instructions.POP;
writableBytes[i++] = R1;

// pop r2
writableBytes[i++] = instructions.POP;
writableBytes[i++] = R2;
```


## Test subroutine implementation
```
const subroutineAddress = 0x3000;
let i = 0x0000;  // program start

// psh 0x3333
writableBytes[i++] = instructions.PSH_LIT;
writableBytes[i++] = 0x33;
writableBytes[i++] = 0x33;

// psh 0x2222
writableBytes[i++] = instructions.PSH_LIT;
writableBytes[i++] = 0x22;
writableBytes[i++] = 0x22;

// psh 0x1111
writableBytes[i++] = instructions.PSH_LIT;
writableBytes[i++] = 0x11;
writableBytes[i++] = 0x11;

// mov 0x1234, r1
writableBytes[i++] = instructions.MOV_LIT_REG;
writableBytes[i++] = 0x12;
writableBytes[i++] = 0x34;
writableBytes[i++] = R1;

// mov 0x4567, r4
writableBytes[i++] = instructions.MOV_LIT_REG;
writableBytes[i++] = 0x45;
writableBytes[i++] = 0x46;
writableBytes[i++] = R4;

// psh 0x0000
writableBytes[i++] = instructions.PSH_LIT;
writableBytes[i++] = 0x00;
writableBytes[i++] = 0x00;

// cal my_subroutine:
writableBytes[i++] = instructions.CALL_LIT;
writableBytes[i++] = (subroutineAddress & 0xff00) >> 8;
writableBytes[i++] = (subroutineAddress & 0x00ff);

// psh 0x4444
writableBytes[i++] = instructions.PSH_LIT;
writableBytes[i++] = 0x44;
writableBytes[i++] = 0x44;

// ;; at address 0x3000
// my_subroutine: 
i = subroutineAddress;
// psh 0x0102
writableBytes[i++] = instructions.PSH_LIT;
writableBytes[i++] = 0x01;
writableBytes[i++] = 0x02;

// psh 0x0304
writableBytes[i++] = instructions.PSH_LIT;
writableBytes[i++] = 0x03;
writableBytes[i++] = 0x04;

// psh 0x0506
writableBytes[i++] = instructions.PSH_LIT;
writableBytes[i++] = 0x05;
writableBytes[i++] = 0x06;

// mov 0x0708, r1
writableBytes[i++] = instructions.MOV_LIT_REG;
writableBytes[i++] = 0x07;
writableBytes[i++] = 0x08;
writableBytes[i++] = R1;

// mov 0x090A, r8
writableBytes[i++] = instructions.MOV_LIT_REG;
writableBytes[i++] = 0x09;
writableBytes[i++] = 0x0A;
writableBytes[i++] = R8;

// ret
writableBytes[i++] = instructions.RET;

```